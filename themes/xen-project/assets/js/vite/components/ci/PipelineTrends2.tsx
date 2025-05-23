import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {type PipelineJobsResult} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';

export default function PipelineTrends2({pipelines}: {readonly pipelines: PipelineJobsResult[]}) {
  const pipelinesOldestFirst = pipelines.toReversed();
  const data = pipelinesOldestFirst.map((p) => {
    const testJobs = p.jobs.filter((j) => j.raw.stage?.name === 'test');
    const passed = testJobs.filter((j) => j.raw.status === 'SUCCESS').length;
    const failed = testJobs.filter((j) => j.raw.status === 'FAILED').length;
    const unknown = testJobs.filter((j) => !['FAILED', 'SUCCESS'].includes(j.raw.status)).length;
    return {
      name: `#${p.pipeline.id.split('/').at(-1)}`,
      Passed: passed,
      Failed: failed,
      Other: unknown,
    };
  });

  return (
    <div className="uno-mt-12 uno-p-4 uno-rounded-xl uno-border uno-border-solid uno-border-brand-fill uno-bg-surface">
      <h2 className="uno-text-xl uno-font-semibold uno-mb-4">Test Trends (Area Chart)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} stackOffset="none">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            allowDecimals={false}
            label={{value: 'Number of Jobs', angle: -90, position: 'insideLeft', dy: 0, style: {textAnchor: 'middle'}}}
          />
          <Tooltip />
          <Legend />
          <Area dot type="linear" dataKey="Passed" stackId="1" stroke="#85c241" fill="#85c241" />
          <Area dot type="linear" dataKey="Failed" stackId="1" stroke="#f87171" fill="#f87171" />
          <Area dot type="linear" dataKey="Other" stackId="1" stroke="#94A3B8" fill="#94A3B8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
