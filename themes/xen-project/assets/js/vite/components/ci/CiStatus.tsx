import {Fragment, lazy, Suspense} from 'preact/compat';
import {type Job, useGitlabPipelineJobs} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';
import {StatusPill} from '../HardwareGrid/StatusPill.tsx';
import boardAdl from '../../assets/intel-core-i7.png';
import LoadingGitlab from './LoadingGitlab.tsx';
import PipelineTrends2 from './PipelineTrends2.tsx';
import {JobHeatmap} from './JobHeatmap.tsx';

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

  const {pipeline: lastPipeline, jobs: lastJobs, pipelineDate: lastPipelineDate} = pipelines?.[0] ?? {};

  const jobsByLocation = new Map<string, Job[]>();
  for (const job of lastJobs) {
    const {location: city} = job;
    jobsByLocation.set(city, [...(jobsByLocation.get(city) ?? []), job]);
  }

  return (
    <div className="uno-section-nested uno-animate-fade-in">
      <section className="uno-flex uno-flex-row uno-flex-wrap uno-gap-4 uno-items-center uno-w-full uno-text-sm uno-border-1 uno-border-solid uno-border-brand-fill uno-p-4 uno-rounded-xl uno-bg-surface">
        <StatusPill status={lastPipeline.status} label={lastPipeline.detailedStatus.label} />
        <div className="uno-flex uno-flex-row uno-gap-4">
          <div>
            Last pipeline run:{' '}
            <code className="uno-font-semibold">
              <a
                className=""
                href={`https://gitlab.com/xen-project/hardware/xen/-/pipelines/${lastPipeline?.id?.split('/')?.pop() ?? ''}`}
              >
                #{lastPipeline.id.split('/').at(-1)}
              </a>{' '}
              (staging)
            </code>
          </div>
          <div className="">
            Started at: <code className="uno-font-semibold">{lastPipelineDate.toLocaleString()}</code>
          </div>
          <div className="">
            Duration:{' '}
            <code className="uno-font-semibold">
              {lastPipeline.duration ? `${Math.floor(lastPipeline.duration / 60)}m${lastPipeline.duration % 60}s` : '-'}
            </code>
          </div>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="uno-h-120 uno-flex uno-flex-col uno-items-center uno-justify-center">
            <LoadingGitlab />
          </div>
        }
      >
        <TestGlobe jobs={jobsByLocation} />
      </Suspense>
      <div className="uno-grid uno-grid-cols-1 sm:uno-grid-cols-2 uno-gap-4">
        {[...jobsByLocation.entries()].map(([location, locationJobs]) => {
          const jobsByPlatform = Object.groupBy(locationJobs, (job) => job.platform);

          return (
            <div
              key={location}
              className="uno-card uno-grid uno-grid-cols-[1fr_auto] uno-gap-2 uno-content-start uno-items-center"
            >
              <div className="uno-text-3xl uno-font-semibold uno-p-b-4 uno-col-span-2">🌐 {location}</div>
              {Object.entries(jobsByPlatform).map(([platform, platformJobs]) => {
                if (!platformJobs) {
                  return null;
                }

                return (
                  <Fragment key={platform}>
                    <div className="uno-flex uno-flex-row uno-gap-2 uno-items-center uno-p-t-4 uno-col-span-2 uno-justify-between">
                      <div className="uno-text-2xl uno-font-semibold">{platform}</div>
                      {platformJobs[0].image ? (
                        <img className="uno-w-16" src={platformJobs[0].image} />
                      ) : (
                        <div className="uno-flex-grow" />
                      )}
                    </div>
                    {platformJobs.map((job) => {
                      // Const {platform, location, lat, lng, icons} = parseJobData(job.raw.name);
                      return (
                        <Fragment key={job.raw.id}>
                          {/* <div key={job.raw.id} className="uno-flex uno-gap-2 uno-justify-between uno-items-center"> */}
                          <div className="uno-text-sm">{job.raw.name}</div>
                          {/* <div className="uno-text-sm">{job.raw.status}</div> */}
                          {/* <div className="uno-text-sm">{job.raw.detailedStatus.label}</div> */}
                          <StatusPill status={job.raw.status} label={job.raw.detailedStatus.label} />
                          {/* <div className="uno-text-sm">{job.raw.detailedStatus.favicon}</div> */}
                          {/* </div> */}
                        </Fragment>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
      <details open className="uno-parent">
        <summary className="text-blue-600 font-medium cursor-pointer">Show Test Trends</summary>
        <div className="mt-4 parent-open:uno-scale-100 uno-scale-0">
          <PipelineTrends2 pipelines={pipelines} />
        </div>
      </details>
      <details open className="uno-parent">
        <summary className="text-blue-600 font-medium cursor-pointer">Show Test Trends</summary>
        <div className="mt-4 parent-open:uno-scale-100 uno-scale-0">
          <JobHeatmap pipelines={pipelines} />
        </div>
      </details>
      <div className="uno-grid uno-grid-cols-3">
        <img className="uno-w-full uno-aspect-square uno-object-contain uno-card" src={boardAdl} />
      </div>
    </div>
  );
}
