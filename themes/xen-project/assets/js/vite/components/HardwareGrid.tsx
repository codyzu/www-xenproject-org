import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import clsx from 'clsx';
import { z } from 'zod';

const statusStyles = {
  SUCCESS: {
    icon: 'i-fa6-solid:circle-check',
    color: 'uno-text-green-500',
  },
  FAILED: {
    icon: 'i-fa6-solid:circle-xmark',
    color: 'uno-text-red-500',
  },
  CREATED: {
    icon: 'i-fa6-solid-hourglass-half',
    color: 'uno-text-yellow-500',
  },
  PENDING: {
    icon: 'i-fa6-solid-hourglass-half',
    color: 'uno-text-yellow-500',
  },
  RUNNING: {
    icon: 'i-fa6-solid-hourglass-half',
    color: 'uno-text-yellow-500',
  },
  DEFAULT: {
    icon: 'i-fa6-solid-circle-question',
    color: 'uno-text-gray-500',
  },
};

type StatusType = keyof typeof statusStyles;

const harwareIcons = {
  ampere: 'i-mdi-cpu-64-bit',
  pi: 'i-simple-icons-raspberrypi',
  rockchip: 'i-mdi-chip',
  intel: 'i-fa6-solid-microchip',
  arm: 'i-mdi-raspberry-pi',
  unknown: 'i-mdi-help-box',
};

function getHardwareIcon(name: string) {
  name = name.toLowerCase();
  if (name.includes('ampere')) return harwareIcons.ampere;
  if (name.includes('pi')) return harwareIcons.pi;
  if (name.includes('rockchip')) return harwareIcons.rockchip;
  if (name.includes('x86') || name.includes('intel')) return harwareIcons.intel;
  if (name.includes('arm')) return harwareIcons.arm;
  return harwareIcons.unknown;
}

function parseJobName(name: string) {
  const parts = name.split('-');
  const [platform, testType, ...rest] = parts;
  let mode, arch, compiler;
  const variantParts: string[] = [];

  for (const part of rest) {
    if (!mode && /^(dom0|dom0less|pv|pvh|hvm)$/.test(part)) mode = part;
    else if (!arch && /^(x86(?:_64)?|arm(?:64|32)|ppc64le|riscv64)$/.test(part)) arch = part;
    else if (!compiler && /^(gcc|clang)$/.test(part)) compiler = part;
    else variantParts.push(part);
  }

  return { platform, testType, mode, arch, compiler, variant: variantParts.join(', ') };
}

const PipelineSchema = z.object({
  id: z.string(),
  iid: z.string(),
  source: z.string(),
  jobs: z.object({
    nodes: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
        stage: z.object({ name: z.string() }).nullable(),
        detailedStatus: z.object({
          label: z.string(),
          favicon: z.string(),
        }),
      })
    ),
  }),
});

const GraphQLResponseSchema = z.object({
  data: z.object({
    project: z
      .object({
        pipelines: z
          .object({
            pageInfo: z.object({
              endCursor: z.string().nullable(),
              hasNextPage: z.boolean(),
            }),
            nodes: z.array(PipelineSchema),
          })
          .nullable(),
      })
      .nullable(),
  }),
});

async function getLatestNonScheduledPipeline(apiUrl: string, projectPath: string, maxTries = 5) {
  const query = `
    query getLatestPipeline($projectPath: ID!, $after: String) {
      project(fullPath: $projectPath) {
        pipelines(first: 1, after: $after) {
          pageInfo { endCursor hasNextPage }
          nodes {
            id iid source
            jobs {
              nodes {
                id name status
                stage { name }
                detailedStatus { label favicon }
              }
            }
          }
        }
      }
    }`;

  let afterCursor = null;
  for (let i = 0; i < maxTries; i++) {
    const res: Response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { projectPath, after: afterCursor } }),
    });
    const json = await res.json();

    // Validate the response using Zod
    const parsed = GraphQLResponseSchema.safeParse(json);
    if (!parsed.success) {
      console.error('Invalid GraphQL response:', parsed.error);
      return null;
    }

    const page = parsed.data.data.project?.pipelines;
    const node = page?.nodes?.[0];
    if (!node) break;
    if (node.source !== 'schedule') return node;
    afterCursor = page?.pageInfo?.endCursor;
  }
  return null;
}

type ParsedJobType = z.infer<typeof PipelineSchema>['jobs']['nodes'][number] & {
  parsed: {
    platform?: string;
    testType?: string;
    mode?: string;
    arch?: string;
    compiler?: string;
    variant?: string;
  };
};

export function HardwareGrid() {
  const [pipeline, setPipeline] = useState<any>(null);
  const [jobs, setJobs] = useState<ParsedJobType[]>([]);

  useEffect(() => {
    const load = async () => {
      const API = 'https://gitlab.com/api/graphql';
      const PATH = 'xen-project/hardware/xen';
      const pipeline = await getLatestNonScheduledPipeline(API, PATH);
      if (!pipeline) return;

      const jobs = (pipeline.jobs.nodes || [])
        .map(j => ({ ...j, parsed: parseJobName(j.name) }))
        .filter(j => j.stage?.name === 'test')
        .filter(j => j.parsed.platform !== 'qemu')
        .filter(j => j.parsed.testType !== 'suspend')
        .filter(j => j.name !== 'build-each-commit-gcc')
        .sort((a, b) => a.name.localeCompare(b.name));

      setPipeline(pipeline);
      setJobs(jobs);
    };
    load();
  }, []);

  const grouped: Record<string, ParsedJobType[]> = {};
  for (const job of jobs) {
    const key = job.parsed.platform || 'unknown';
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(job);
  }

  return (
    <div class="uno-section">
      {Object.entries(grouped).map(([platform, jobs]) => (
        <div>
          <h3 class="uno-text-lg uno-font-semibold uno-mb-2 uno-mt-4">Platform: {platform}</h3>
          <div class="uno-grid uno-grid-cols-2 sm:uno-grid-cols-2 md:uno-grid-cols-3 lg:uno-grid-cols-4 uno-gap-4 uno-justify-start">
            {jobs.map(job => {
              const style = statusStyles[job.status as StatusType] || statusStyles.DEFAULT;
              return (
                <div
                  class={clsx(
                    'uno-px-3 uno-py-2 uno-rounded-lg uno-flex uno-flex-col uno-items-start uno-gap-3 uno-text-xs',
                    'uno-border-0 uno-border-t-12 uno-border-brand-fill uno-border-solid',
                    'uno-shadow-xl uno-shadow-gray-300 uno-bg-white uno-text-primary'
                  )}
                >
                  <div class="uno-flex uno-items-start uno-gap-2">
                    <div class={`${getHardwareIcon(job.name)} uno-text-4xl uno-flex-shrink-0`} title="Hardware" />
                    <div class="uno-flex uno-gap-1 uno-flex-wrap uno-items-center">
                      {job.parsed.arch && <span class="uno-bg-gray-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs uno-font-semibold">{job.parsed.arch}</span>}
                      {job.parsed.mode && <span class="uno-bg-green-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs">{job.parsed.mode}</span>}
                      {job.parsed.compiler && <span class="uno-bg-blue-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs">{job.parsed.compiler}</span>}
                      {job.parsed.variant && job.parsed.variant.split(', ').map(v => (
                        <span class="uno-bg-yellow-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs" title={`Variant: ${v}`}>{v}</span>
                      ))}
                    </div>
                  </div>
                  <div class="uno-flex uno-items-center uno-gap-2 uno-text-right uno-rounded-full uno-p-x-1 uno-p-r-2 uno-p-y-1 uno-bg-secondary uno-text-white">
                    <div class={`${style.icon} uno-text-base ${style.color}`} title={job.status}></div>
                    <div>{job.detailedStatus.label}</div>
                  </div>
                  <details class="uno-flex uno-flex-col uno-gap-1 uno-group">
                    <summary class="marker:uno-hidden uno-list-none uno-flex uno-flex-row uno-gap-2 uno-items-center uno-text-action-text hover:uno-cursor-pointer">
                      <div>details</div>
                      <div class="i-fa6-solid-arrow-right group-open:uno-rotate-90 uno-transition-transform uno-duration-300 uno-ease-out" />
                    </summary>
                    <div>{job.name}</div>
                    <a href={`https://gitlab.com/xen-project/hardware/xen/-/jobs/${job.id.split('/').pop()}`} target="_blank" class="uno-text-blue-600 hover:uno-underline uno-text-xs">
                      View job on GitLab
                    </a>
                  </details>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {pipeline && (
        <a
          href={`https://gitlab.com/xen-project/hardware/xen/-/pipelines/${pipeline.id.split('/').pop()}`}
          class="uno-block uno-mt-4 uno-text-blue-600 hover:uno-underline uno-text-sm"
          target="_blank"
        >
          View pipeline on GitLab
        </a>
      )}
    </div>
  );
}