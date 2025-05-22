import {Fragment, lazy, Suspense} from 'preact/compat';
import {type Job, useGitlabPipelineJobs} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';
import {parseJobData} from '../HardwareGrid/gitlab-jobs.ts';
import {StatusPill} from '../HardwareGrid/StatusPill.tsx';
import boardAdl from '../../assets/intel-core-i7.png';
import LoadingGitlab from './LoadingGitlab.tsx';

const TestGlobe = lazy(async () => {
  const [module] = await Promise.all([
    import('../TestGlobe.tsx'),
    new Promise((resolve) => {
      setTimeout(resolve, 3000);
    }),
  ]);
  return module;
});

// Const TestGlobe = lazy(async () =>
//   Promise.all([
//     import('../TestGlobe.tsx'),
//     new Promise((resolve) => {
//       setTimeout(resolve, 3000);
//     }),
//   ]).then(([module]) => module),
// );

// Function Loading() {
//   return (
//     <div className="text-3xl uno-flex uno-flex-col uno-items-center uno-animate-pulse">
//       <div>Loading...</div>
//     </div>
//   );
// }

export default function CiStatus() {
  const {loading, error, jobs, pipeline, pipelineDate} = useGitlabPipelineJobs();

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

  if (!jobs) {
    return <div>No jobs found</div>;
  }

  const jobsByLocation = new Map<string, Job[]>();
  for (const job of jobs) {
    const {location: city} = job;
    jobsByLocation.set(city, [...(jobsByLocation.get(city) ?? []), job]);
  }

  return (
    <div className="uno-section-nested uno-animate-fade-in">
      <section className="uno-flex uno-flex-col uno-text-sm uno-border-1 uno-border-solid uno-border-brand-fill uno-p-4 uno-rounded-xl uno-bg-surface">
        <div className="uno-flex uno-flex-row uno-gap-4 uno-items-center uno-w-full">
          <div>
            Last pipeline run:{' '}
            <code className="uno-font-semibold">
              <a
                className=""
                href={`https://gitlab.com/xen-project/hardware/xen/-/pipelines/${pipeline?.id?.split('/')?.pop() ?? ''}`}
              >
                #{pipeline.id.split('/').at(-1)}
              </a>{' '}
              (staging)
            </code>
          </div>
          <div className="">
            Started at: <code className="uno-font-semibold">{pipelineDate.toLocaleString()}</code>
          </div>
          <div className="">
            Duration:{' '}
            <code className="uno-font-semibold">
              {pipeline.duration ? `${Math.floor(pipeline.duration / 60)}m${pipeline.duration % 60}s` : '-'}
            </code>
          </div>
          <div className="uno-flex-grow" />
          <StatusPill status={pipeline.status} label={pipeline.detailedStatus.label} />
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
      <div className="uno-grid uno-grid-cols-2 uno-gap-4">
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
      <div className="uno-grid uno-grid-cols-3">
        <img className="uno-w-full uno-aspect-square uno-object-contain uno-card" src={boardAdl} />
      </div>
    </div>
  );
}
