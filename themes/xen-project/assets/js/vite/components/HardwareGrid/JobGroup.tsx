import {h, Fragment} from 'preact';
import clsx from 'clsx';
import {type ParsedJob} from './schema.ts';

const statusStyles = {
  // These are hardcoded status values from GitLab
  /* eslint-disable @typescript-eslint/naming-convention */
  SUCCESS: {
    icon: 'i-fa6-solid-circle-check',
    color: 'uno-text-green-500',
  },
  FAILED: {
    icon: 'i-fa6-solid-circle-xmark',
    color: 'uno-text-red-500',
  },
  CREATED: {
    icon: 'i-fa6-solid-clock',
    color: 'uno-text-yellow-500',
  },
  PENDING: {
    icon: 'i-fa6-solid-clock',
    color: 'uno-text-yellow-500',
  },
  RUNNING: {
    icon: 'i-fa6-solid-clock',
    color: 'uno-text-yellow-500',
  },
  DEFAULT: {
    icon: 'i-fa6-solid-circle-question',
    color: 'uno-text-gray-500',
  },
  /* eslint-enable @typescript-eslint/naming-convention */
};

type StatusType = keyof typeof statusStyles;

export default function JobGroup({
  platform,
  jobs,
  index,
}: {
  readonly platform: string;
  readonly jobs: ParsedJob[];
  readonly index: number;
}) {
  return (
    <div className="embla__slide uno-flex-[0_0_100%] sm:uno-flex-[0_0_30rem] uno-min-w-0 uno-p-l-4 uno-flex">
      <div className="uno-card uno-grid uno-grid-cols-[1fr_auto] uno-content-start uno-auto-rows-auto uno-items-center uno-gap-1 uno-w-full uno-text-secondary">
        <div className="uno-text-2xl uno-font-semibold uno-text-primary">{platform}</div>
        <div className="uno-flex uno-flex-col uno-gap-2 uno-items-center">
          {jobs[0].parsed.icons.map((icon) => (
            <div
              key={icon}
              className="uno-border-1 uno-border-secondary uno-rounded-lg uno-border-solid uno-border uno-shadow-xl uno-shadow-gray-300 uno-p-1"
            >
              <div className={clsx(icon, 'uno-text-6xl uno-flex-shrink-0')} />
            </div>
          ))}
        </div>

        <div className="uno-grid-col-span-2 uno-text-lg uno-font-semibold">Jobs:</div>
        {jobs.map((job) => {
          const style = statusStyles[job.status as StatusType] || statusStyles.DEFAULT;
          return (
            <Fragment key={job.id}>
              <a
                href={`https://gitlab.com/xen-project/hardware/xen/-/jobs/${job.id.split('/').pop()}`}
                target="_blank"
                className="uno-text-blue-600 hover:uno-underline uno-text-xs uno-flex-1"
                rel="noreferrer"
              >
                {job.name}
              </a>
              <div className="uno-flex uno-items-center uno-gap-2 uno-text-right uno-rounded-full uno-p-x-1 uno-p-r-2 uno-p-y-1 uno-bg-secondary uno-text-white">
                <div className={clsx(style.icon, style.color, 'uno-text-base')} title={job.status} />
                <div className="uno-text-xs">{job.detailedStatus.label}</div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
