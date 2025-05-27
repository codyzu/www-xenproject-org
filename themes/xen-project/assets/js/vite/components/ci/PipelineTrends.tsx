import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import {Fragment} from 'preact/jsx-runtime';
import type {TickItem} from 'recharts/types/util/types';
import {type PipelineJobsResult} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';
import {StatusPill} from '../HardwareGrid/StatusPill.tsx';

export default function PipelineTrends2({pipelines}: {readonly pipelines: PipelineJobsResult[]}) {
  const pipelinesOldestFirst = pipelines.toReversed();
  const data = pipelinesOldestFirst.map((p) => {
    const testJobs = p.jobs.filter((j) => j.raw.stage?.name === 'test');
    const success = testJobs.filter((j) => j.raw.status === 'SUCCESS').length;
    const failed = testJobs.filter((j) => j.raw.status === 'FAILED').length;
    const unknown = testJobs.filter((j) => !['FAILED', 'SUCCESS'].includes(j.raw.status)).length;
    return {
      name: `#${p.pipeline.id.split('/').at(-1)}`,
      Success: success,
      Failed: failed,
      Other: unknown,
    };
  });

  const hasOther = data.some((d) => d.Other > 0);

  return (
    <div className="uno-card">
      <h2 className="uno-text-xl uno-font-semibold uno-mb-4">Test Trend</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} stackOffset="none">
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#85c241" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#85c241" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="otherGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={<CustomXaxisTick />} />
          <YAxis
            allowDecimals={false}
            tick={{fill: '#64748b', fontSize: 13}}
            label={{
              value: 'Number of Jobs',
              angle: -90,
              position: 'insideLeft',
              dy: 0,
              style: {textAnchor: 'middle', fill: '#64748b', fontSize: 14},
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => {
              return (
                <div className="uno-inline-flex">
                  <StatusPill status={value.toUpperCase()} label={value} />
                </div>
              );
            }}
          />
          <Area
            dot
            type="monotone"
            dataKey="Success"
            stackId="1"
            stroke="#22c55e"
            fill="url(#successGradient)"
            strokeWidth={3}
            activeDot={{r: 8}}
          />
          <Area
            dot
            type="monotone"
            dataKey="Failed"
            stackId="1"
            stroke="#ef4444"
            fill="url(#failedGradient)"
            strokeWidth={3}
            activeDot={{r: 8}}
          />
          {hasOther ? (
            <Area
              dot
              type="monotone"
              dataKey="Other"
              stackId="1"
              stroke="#94A3B8"
              fill="url(#otherGradient)"
              strokeWidth={3}
              activeDot={{r: 8}}
            />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({active, payload, label}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="uno-grid uno-grid-cols-[auto_1fr] uno-gap-x-2 uno-gap-y-1 uno-bg-surface uno-border uno-border-gray-200 uno-rounded-lg uno-shadow-xl uno-p-3 uno-text-sm uno-bg-opacity-80">
      <div className="uno-font-semibold uno-mb-1 uno-col-span-2">{label}</div>
      {payload.map((entry) => (
        <Fragment key={entry.dataKey}>
          <span className="uno-font-mono">{entry.value}</span>
          <StatusPill
            status={String(entry.dataKey ?? 'Other').toUpperCase()}
            label={String(entry.dataKey ?? 'Other')}
          />
        </Fragment>
      ))}
    </div>
  );
}

type CustomXaxisTickProps = {
  readonly x?: number;
  readonly y?: number;
  readonly payload: TickItem;
};

function CustomXaxisTick(props: any) {
  console.log('CustomXaxisTick', props);
  const {payload, x, y} = props as CustomXaxisTickProps;
  return (
    <g transform={`translate(${x},${y})`}>
      <a
        href={`https://gitlab.com/xen-project/hardware/xen/-/pipelines/${payload.value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="uno-text-action-text uno-font-mono"
      >
        <text x={0} y={0} dy={16} textAnchor="middle" fill="currentColor" fontSize={13} style={{cursor: 'pointer'}}>
          {payload.value}
        </text>
      </a>
    </g>
  );
}
