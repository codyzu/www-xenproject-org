import {lazy, Suspense} from 'preact/compat';
import {type Job, useGitlabPipelineJobs} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';
import {parseJobData} from '../HardwareGrid/gitlab-jobs.ts';
import {StatusPill} from '../HardwareGrid/StatusPill.tsx';
import boardAdl from '../../assets/intel-core-i7.png';

const TestGlobe = lazy(async () => import('../TestGlobe.tsx'));

function Loading() {
  return (
    <div className="text-3xl uno-flex uno-flex-col uno-items-center uno-animate-pulse">
      <div>Loading...</div>
    </div>
  );
}

export default function CiStatus() {
  const {loading, error, jobs, pipeline, pipelineDate} = useGitlabPipelineJobs();

  if (loading) {
    return <Loading />;
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
    <div className="uno-section-nested">
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
          <div className="uno-text-xs">
            Started at: <code className="uno-font-semibold">{pipelineDate.toLocaleString()}</code>
          </div>
          <div className="uno-text-xs">
            Duration:{' '}
            <code className="uno-font-semibold">
              {pipeline.duration ? `${Math.floor(pipeline.duration / 60)}m${pipeline.duration % 60}s` : '-'}
            </code>
          </div>
          <div className="uno-flex-grow" />
          <StatusPill status={pipeline.status} label={pipeline.detailedStatus.label} />
        </div>
      </section>
      <Suspense fallback={<Loading />}>
        <TestGlobe jobs={jobsByLocation} />
      </Suspense>
      <div className="uno-grid uno-grid-cols-2 uno-gap-4 uno-auto-rows-[1fr]">
        {[...jobsByLocation.entries()].map(([location, locationJobs]) => {
          const jobsByPlatform = Object.groupBy(locationJobs, (job) => job.platform);

          return (
            <div key={location} className="uno-card">
              <div className="uno-text-3xl uno-font-semibold">🌐 {location}</div>
              {Object.entries(jobsByPlatform).map(([platform, platformJobs]) => {
                if (!platformJobs) {
                  return null;
                }

                return (
                  <div key={platform} className="uno-flex uno-flex-col uno-gap-2">
                    <div className="uno-text-2xl uno-font-semibold">{platform}</div>
                    {platformJobs.map((job) => {
                      // Const {platform, location, lat, lng, icons} = parseJobData(job.raw.name);
                      return (
                        <div key={job.raw.id} className="uno-flex uno-gap-2 uno-justify-between uno-items-center">
                          <div className="uno-text-sm">{job.raw.name}</div>
                          {/* <div className="uno-text-sm">{job.raw.status}</div> */}
                          {/* <div className="uno-text-sm">{job.raw.detailedStatus.label}</div> */}
                          <StatusPill status={job.raw.status} label={job.raw.detailedStatus.label} />
                          {/* <div className="uno-text-sm">{job.raw.detailedStatus.favicon}</div> */}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="uno-grid uno-grid-cols-3">
        <img className="uno-w-full uno-aspect-square uno-object-contain" src={boardAdl} />
      </div>
    </div>
  );
}
