/** @jsxImportSource preact */
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend} from 'chart.js';
import {type PipelineJobsResult} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function PipelineTrends({pipelines}: {readonly pipelines: PipelineJobsResult[]}) {
  const pipelinesOldestFirst = pipelines.toReversed();
  const labels = pipelinesOldestFirst.map((p) => `#${p.pipeline.iid}`);

  const pipelineTestJobs = pipelinesOldestFirst.map((p) => p.jobs.filter((j) => j.raw.stage?.name === 'test'));
  const passedJobs = pipelineTestJobs.map((p) => p.filter((j) => j.raw.status === 'SUCCESS').length);
  const failedJobs = pipelineTestJobs.map((p) => p.filter((j) => j.raw.status === 'FAILED').length);

  console.log('Pipeline Test Jobs:', pipelineTestJobs, 'Passed Jobs:', passedJobs, 'Failed Jobs:', failedJobs);
  // Const passedData = pipelinesOldestFirst.map(
  //   (p) => p.pipeline.jobs.nodes.filter((j) => j.status === 'SUCCESS').length,
  // );
  // const failedData = pipelinesOldestFirst.map((p) => p.pipeline.jobs.nodes.filter((j) => j.status === 'FAILED').length);

  const data = {
    labels,
    datasets: [
      {
        label: 'Passed',
        data: passedJobs,
        backgroundColor: '#85c241',
      },
      {
        label: 'Failed',
        data: failedJobs,
        backgroundColor: '#f87171',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Pipeline Test Results Over Time',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      legend: {
        display: true,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Number of Jobs',
        },
      },
    },
  };

  return (
    <div className="uno-mt-12 uno-p-4 uno-rounded-xl uno-border uno-border-solid uno-border-brand-fill uno-bg-surface">
      <h2 className="uno-text-xl uno-font-semibold uno-mb-4">Test Trends</h2>
      <Bar data={data} options={options} className="uno-h-100" />
    </div>
  );
}
