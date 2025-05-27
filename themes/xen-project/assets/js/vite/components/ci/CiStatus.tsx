import {lazy, Suspense} from 'preact/compat';
import {type Job, useGitlabPipelineJobs} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';
import LoadingGitlab from './LoadingGitlab.tsx';
import PipelineTrends from './PipelineTrends.tsx';
import {JobHeatmap} from './JobHeatmap.tsx';
import {LocationJobs} from './LocationJobs.tsx';
import {PipelineStatus} from './PipelineStatus.tsx';

const TestGlobe = lazy(async () => {
  const [module] = await Promise.all([
    import('./TestGlobe.tsx'),
    new Promise((resolve) => {
      setTimeout(resolve, 3000);
    }),
  ]);
  return module;
});

export default function CiStatus() {
  const {loading, error, pipelines} = useGitlabPipelineJobs(10);

  if (loading) {
    return (
      <div className="uno-flex uno-flex-col uno-items-center uno-justify-center uno-min-h-100dvh">
        <LoadingGitlab />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!pipelines || pipelines.length === 0) {
    return <div>No pipelines found</div>;
  }

  const {jobs: lastJobs} = pipelines[0];

  const jobsByLocation = new Map<string, Job[]>();
  for (const job of lastJobs.toSorted((a, b) => a.location.localeCompare(b.location))) {
    const {location: city} = job;
    jobsByLocation.set(city, [...(jobsByLocation.get(city) ?? []), job]);
  }

  return (
    <div className="uno-section-nested uno-animate-fade-in uno-m-t-8">
      <section className="uno-flex uno-flex-col uno-gap-2 uno-m-b-8" id="last-pipeline">
        <h3>Last pipeline</h3>
        <PipelineStatus pipeline={pipelines[0]} />
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
          <TestGlobe jobs={jobsByLocation} />
        </Suspense>
        <LocationJobs jobsByLocation={jobsByLocation} />
      </section>
      <section className="uno-flex uno-flex-col uno-gap-2 uno-m-b-8 id" id="pipeline-trends">
        <h3>Pipeline trends</h3>
        <div className="">
          <PipelineTrends pipelines={pipelines} />
        </div>
      </section>
      <section className="uno-flex uno-flex-col uno-gap-2 uno-m-b-8" id="job-heatmap">
        <h3>Job heatmap</h3>
        <div className="">
          <JobHeatmap pipelines={pipelines} />
        </div>
      </section>
    </div>
  );
}
