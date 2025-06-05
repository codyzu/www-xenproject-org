import {h, Fragment} from 'preact';
import clsx from 'clsx';
import {type Job} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';
import {StatusPill} from './StatusPill.tsx';

export default function JobGroup({platform, jobs}: {readonly platform: string; readonly jobs: Job[]}) {
  return (
    <div className="embla__slide uno-flex-[0_0_100%] sm:uno-flex-[0_0_30rem] uno-min-w-0 uno-p-l-4 uno-flex">
      <div className="uno-card uno-shadow-gray-300 uno-grid uno-grid-cols-[1fr_auto] uno-content-start uno-auto-rows-auto uno-items-center uno-gap-1 uno-w-full uno-text-secondary uno-max-h-[60dvh] uno-overflow-y-auto">
        <div className="uno-text-2xl uno-font-semibold uno-text-primary">{platform}</div>
        <div className="uno-flex uno-flex-col uno-gap-2 uno-items-center">
          {jobs[0].icons.map((icon) => (
            <div
              key={icon.className}
              className="uno-border-1 uno-border-secondary uno-rounded-lg uno-border-solid uno-border uno-shadow-xl uno-shadow-gray-300 uno-p-1"
            >
              <div className={clsx(icon.className, 'uno-text-6xl uno-flex-shrink-0')} />
            </div>
          ))}
        </div>

        <div className="uno-grid-col-span-2 uno-text-lg uno-font-semibold">Jobs:</div>
        {jobs.map((job) => {
          return (
            <Fragment key={job.raw.id}>
              <a
                href={`https://gitlab.com/xen-project/hardware/xen/-/jobs/${job.raw.id.split('/').pop()}`}
                target="_blank"
                className="uno-text-blue-600 hover:uno-underline uno-text-xs uno-flex-1"
                rel="noreferrer"
              >
                {job.raw.name}
              </a>
              <StatusPill status={job.raw.status} label={job.raw.detailedStatus.label} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
