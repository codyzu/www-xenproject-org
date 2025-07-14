import {lazy, Suspense, useMemo, useState} from 'react';
import {
  getJobGroupStatus,
  type JobWithLocation,
  type JobLocation,
  useGitlabPipelineJobs,
} from './use-gitlab-pipeline-jobs.ts';
import LoadingGitlab from './LoadingGitlab.tsx';
import {JobHeatmap} from './JobHeatmap.tsx';
import {LocationJobs} from './LocationJobs.tsx';
import {PipelineStatus} from './PipelineStatus.tsx';
import TestLegend from './TestLegend.tsx';

// We know the components will be used, so we can preload them to improve performance.
void import('./TestGlobe.tsx');
void import('./PipelineTrends.tsx');

// Finally, lazy load the components so we can use Suspense
const TestGlobe = lazy(async () => {
  const [module] = await Promise.all([
    import('./TestGlobe.tsx'),
    new Promise((resolve) => {
      setTimeout(resolve, 3000);
    }),
  ]);
  return module;
});
const PipelineTrends = lazy(async () => import('./PipelineTrends.tsx'));

export default function CiStatus() {
  const [{isHwTestsVisible, isQemuTestsVisible}, setVisibleTests] = useState<{
    isHwTestsVisible: boolean;
    isQemuTestsVisible: boolean;
  }>({isHwTestsVisible: true, isQemuTestsVisible: true});
  const {loading, error, pipelines} = useGitlabPipelineJobs(10);

  const jobsByLocation: Map<string, JobWithLocation[]> = useMemo(() => {
    if (loading || error !== undefined || pipelines === undefined || pipelines.length === 0) {
      return new Map<string, JobWithLocation[]>();
    }

    const jobsWithLocations: JobWithLocation[] = pipelines[0].jobs.flatMap((job) =>
      job.locations.map((location) => ({
        ...job,
        location,
      })),
    );

    const locationGroupedJobs: Map<string, JobWithLocation[]> = Map.groupBy(
      jobsWithLocations,
      (job) => job.location.name,
    );

    return locationGroupedJobs;
  }, [pipelines, loading, error]);

  const locations: Map<string, JobLocation> = useMemo(() => {
    return new Map<string, JobLocation>(
      [...jobsByLocation.entries()]
        .toSorted(([locationA], [locationB]) => locationA.localeCompare(locationB))
        .map(([location, jobs]) => {
          const visibleJobs = jobs.filter((job) => {
            if (job.jobType === 'hardware') {
              return isHwTestsVisible;
            }

            if (job.jobType === 'qemu') {
              return isQemuTestsVisible;
            }

            return false; // Include all other jobs
          });

          // No jobs, return undefined to filter out later
          if (visibleJobs.length === 0) {
            return undefined;
          }

          const status = getJobGroupStatus(visibleJobs);
          return [
            location,
            {
              jobs: visibleJobs,
              status,
              location: visibleJobs[0].location,
            },
          ];
        })
        // Filter out undefined entries
        .filter((entry): entry is [string, JobLocation] => entry !== undefined),
    );
  }, [jobsByLocation, isHwTestsVisible, isQemuTestsVisible]);

  if (loading) {
    return (
      <div className="uno-flex uno-flex-col uno-items-center uno-justify-center uno-min-h-100dvh">
        <LoadingGitlab />
      </div>
    );
  }

  if (error) {
    return (
      <div className="uno-flex uno-flex-col uno-items-center uno-justify-center uno-min-h-100 uno-gap-4">
        <div className="i-fa6-solid-fire-extinguisher uno-w-24 uno-h-24 uno-text-red-500" />
        <div>Something went wrong.</div>
        <div className="uno-text-sm">Please check the console for more details.</div>
      </div>
    );
  }

  // This will never happen because the hook will throw an error if there are no pipelines.
  // However, we need the guard statement to satisfy TypeScript.
  if (!pipelines || pipelines.length === 0) {
    return <div>No pipelines found</div>;
  }

  return (
    <div className="uno-section-nested uno-animate-fade-in uno-m-t-8">
      <section className="uno-flex uno-flex-col uno-gap-2 uno-m-b-8" id="last-pipeline">
        <h3>Last pipeline</h3>
        <PipelineStatus pipeline={pipelines[0]} />
      </section>
      <section>
        <h3>Test filters</h3>
        <TestLegend
          isHwTestsVisible={isHwTestsVisible}
          isQemuTestsVisible={isQemuTestsVisible}
          onToggleHwTests={() => {
            setVisibleTests((previous) => ({...previous, isHwTestsVisible: !previous.isHwTestsVisible}));
          }}
          onToggleQemuTests={() => {
            setVisibleTests((previous) => ({...previous, isQemuTestsVisible: !previous.isQemuTestsVisible}));
          }}
        />
      </section>
      <section className="uno-flex uno-flex-col uno-gap-2 uno-m-b-8" id="global-test-status">
        <h3>Global test status</h3>
        <Suspense
          fallback={
            <div className="uno-h-120 uno-flex uno-flex-col uno-items-center uno-justify-center">
              <LoadingGitlab />
            </div>
          }
        >
          <TestGlobe locations={locations} />
        </Suspense>
        <LocationJobs locations={locations} />
      </section>
      <section className="uno-flex uno-flex-col uno-gap-2 uno-m-b-8 id" id="pipeline-trends">
        <h3>Pipeline trends</h3>
        <Suspense
          fallback={
            <div className="uno-h-120 uno-flex uno-flex-col uno-items-center uno-justify-center">
              <LoadingGitlab />
            </div>
          }
        >
          <PipelineTrends
            pipelines={pipelines}
            isHwTestsVisible={isHwTestsVisible}
            isQemuTestsVisible={isQemuTestsVisible}
          />
        </Suspense>
      </section>
      <section className="uno-flex uno-flex-col uno-gap-2 uno-m-b-8" id="job-heatmap">
        <h3>Job heatmap</h3>
        <div className="">
          <JobHeatmap
            pipelines={pipelines}
            isHwTestsVisible={isHwTestsVisible}
            isQemuTestsVisible={isQemuTestsVisible}
          />
        </div>
      </section>
    </div>
  );
}
