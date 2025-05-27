import {Fragment} from 'preact/compat';
import {type Status, StatusPill} from '../HardwareGrid/StatusPill.tsx';
import {type Job} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';

export function LocationJobs({jobsByLocation}: {readonly jobsByLocation: Map<string, Job[]>}) {
  return (
    <div className="uno-grid uno-grid-cols-1 sm:uno-grid-cols-2 uno-gap-4">
      {[...jobsByLocation.entries()].map(([location, locationJobs]) => {
        const status: Status = locationJobs.every((j) => j.raw.status === 'SUCCESS')
          ? 'SUCCESS'
          : locationJobs.some((j) => j.raw.status === 'FAILED')
            ? 'FAILED'
            : 'PENDING';

        const jobsByPlatform = Object.groupBy(locationJobs, (job) => job.platform);
        return (
          <div
            key={location}
            className="uno-card sm:last:odd:(uno-col-span-2 uno-justify-self-center uno-w-[calc(50%_-_1rem)]) uno-grid uno-grid-cols-[1fr_auto] uno-gap-2 uno-content-start uno-items-center"
          >
            <div className="uno-text-4xl uno-font-semibold uno-p-b-4">🌐 {location}</div>
            <div className="uno-p-b-4">
              <StatusPill status={status} label={status.toLowerCase()} />
            </div>
            {Object.entries(jobsByPlatform).map(([platform, platformJobs]) => {
              if (!platformJobs) {
                return null;
              }

              return (
                <Fragment key={platform}>
                  <div className="uno-flex uno-flex-row uno-gap-2 uno-items-center uno-p-t-4 uno-col-span-2 uno-justify-start">
                    {platformJobs[0].image ? (
                      <div className="uno-flex uno-items-center uno-justify-center uno-w-16 uno-h-16 uno-p-1 uno-border-1 uno-border-secondary uno-rounded-lg uno-border-solid uno-shrink-0 uno-shadow-gray-300 uno-shadow-xl">
                        <img className="uno-object-contain" src={platformJobs[0].image} />
                      </div>
                    ) : null}
                    <div className="uno-text-2xl uno-font-semibold uno-flex-shrink">{platform}</div>
                  </div>
                  {platformJobs.map((job) => (
                    <Fragment key={job.raw.id}>
                      <a
                        href={`https://gitlab.com/xen-project/hardware/xen/-/jobs/${job.raw.id.split('/').pop()}`}
                        target="_blank"
                        className="uno-text-action-text hover:uno-underline uno-text-sm uno-flex-1"
                        rel="noreferrer"
                      >
                        {job.raw.name}
                      </a>
                      <StatusPill status={job.raw.status} label={job.raw.detailedStatus.label} />
                    </Fragment>
                  ))}
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
