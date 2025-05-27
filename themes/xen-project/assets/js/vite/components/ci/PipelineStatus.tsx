import {StatusPill} from '../HardwareGrid/StatusPill.tsx';
import {type PipelineJobsResult} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';

export function PipelineStatus({pipeline}: {readonly pipeline: PipelineJobsResult}) {
  const {pipeline: lastPipeline, pipelineDate: lastPipelineDate} = pipeline;

  return (
    <div className="uno-flex uno-flex-row uno-flex-wrap uno-gap-4 uno-items-center uno-w-full uno-text-sm uno-border-1 uno-border-solid uno-border-brand-fill uno-p-4 uno-rounded-xl uno-bg-surface">
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
    </div>
  );
}
