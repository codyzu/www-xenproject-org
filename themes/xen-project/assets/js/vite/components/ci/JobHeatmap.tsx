import {Fragment} from 'preact/jsx-runtime';
import clsx from 'clsx';
import {type PipelineJobsResult} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';

const statusClassMap = new Map<string, string>([
  ['SUCCESS', 'uno-bg-green-500'],
  ['FAILED', 'uno-bg-red-500'],
  ['SKIPPED', 'uno-bg-gray-300'],
  ['CANCELED', 'uno-bg-yellow-300'],
  ['missing', 'uno-bg-gray-100'],
  ['unknown', 'uno-bg-orange-400'],
]);

function getStatusClass(status: string | undefined) {
  if (status === undefined) return statusClassMap.get('missing')!;
  return statusClassMap.get(status) ?? statusClassMap.get('unknown')!;
}

export function JobHeatmap({pipelines: pipelinesNewestFirst}: {readonly pipelines: PipelineJobsResult[]}) {
  const pipelines = pipelinesNewestFirst.toReversed();
  // Collect all unique job names from all pipelines
  const jobNameSet = new Set<string>();
  for (const p of pipelines) {
    for (const j of p.jobs) jobNameSet.add(j.raw.name);
  }

  const jobNames = [...jobNameSet].sort();

  return (
    <div className="uno-card uno-overflow-auto uno-my-8 uno-flex uno-flex-col uno-gap-4 uno-items-start">
      <h2 className="uno-text-xl uno-font-semibold">Job Flake Heatmap</h2>
      <div className="uno-grid uno-grid-cols-[auto_repeat(10,minmax(2rem,auto))] uno-gap-1px uno-text-sm">
        <div className="uno-bg-white uno-font-semibold">Job \\ Pipeline</div>
        {pipelines.map((p) => (
          <div
            key={`header-${p.pipeline.id}`}
            className="uno-bg-white uno-text-center uno-flex uno-items-end uno-justify-center uno-text-action-text uno-font-mono uno-text-sm"
          >
            <a
              href={`https://gitlab.com/xen-project/hardware/xen/-/pipelines/${p.pipeline.id.split('/').at(-1) ?? ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'uno-p-t-2 uno-block uno-text-center uno-leading-none uno-rotate-180 uno-write-vertical-left hover:uno-underline',
              )}
            >
              #{p.pipeline.id.split('/').at(-1)}
            </a>
          </div>
        ))}
        {jobNames.map((jobName) => (
          <Fragment key={`job-${jobName}`}>
            <div className="uno-bg-white uno-font-medium uno-break-words uno-whitespace-normal uno-p-x-1 uno-p-y-2 uno-text-right">
              {jobName}
            </div>
            {pipelines.map((p) => {
              const job = p.jobs.find((j) => j.raw.name === jobName);
              const status = job?.raw.status;
              const label = job?.raw.detailedStatus.label;
              return (
                <div
                  key={`cell-${p.pipeline.id}-${jobName}`}
                  className={clsx(
                    'uno-min-w-8 uno-max-w-auto uno-min-h-6 uno-max-h-auto uno-aspect-square uno-border uno-border-gray-200 uno-rounded-sm',
                    getStatusClass(status),
                    'hover:(uno-scale-120 uno-shadow-xl uno-opacity-80) uno-transition-transform uno-duration-140 uno-ease-in-out',
                  )}
                  title={label ?? 'not run'}
                >
                  <span className="uno-sr-only">{label}</span>
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
      <div className="uno-flex uno-flex-row uno-gap-4 uno-flex-wrap uno-justify-center uno-w-full">
        {[...statusClassMap.entries()].map(([status, className]) => (
          <div key={status} className="uno-flex uno-items-center uno-gap-1">
            <span className={clsx('uno-w-6 uno-h-6 uno-rounded-sm', className)} />
            <span className="uno-text-xs">{status.toLowerCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
