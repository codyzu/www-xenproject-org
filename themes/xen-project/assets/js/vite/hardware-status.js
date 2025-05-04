// static/js/hardware-status.js
import clsx from "clsx";

const STATUS_STYLES = {
  SUCCESS: {
    icon: "i-fa6-solid:circle-check",
    color: "uno-text-green-500"
  },
  FAILED: {
    icon: "i-fa6-solid:circle-xmark",
    color: "uno-text-red-500"
  },
  CREATED: {
    icon: "i-fa6-solid-hourglass-half",
    color: "uno-text-yellow-500"
  },
  PENDING: {
    icon: "i-fa6-solid-hourglass-half",
    color: "uno-text-yellow-500"
  },
  RUNNING: {
    icon: "i-fa6-solid-hourglass-half",
    color: "uno-text-yellow-500"
  },
  DEFAULT: {
    icon: "i-fa6-solid-circle-question",
    color: "uno-text-gray-500"
  }
};

const HARDWARE_ICONS = {
  ampere: 'i-mdi-cpu-64-bit',
  pi: 'i-simple-icons-raspberrypi',
  rockchip: 'i-mdi-chip',
  intel: 'i-fa6-solid-microchip',
  arm: 'i-mdi-raspberry-pi',
  unknown: 'i-mdi-help-box'
};

const getHardwareIcon = (jobName) => {
  const name = jobName.toLowerCase();
  if (name.includes('ampere')) return HARDWARE_ICONS.ampere;
  if (name.includes('pi')) return HARDWARE_ICONS.pi;
  if (name.includes('rockchip')) return HARDWARE_ICONS.rockchip;
  if (name.includes('x86') || name.includes('intel')) return HARDWARE_ICONS.intel;
  if (name.includes('arm')) return HARDWARE_ICONS.arm;
  return HARDWARE_ICONS.unknown;
};

function parseJobName(name) {
  const parts = name.split('-');

  const [platform, testType, ...rest] = parts;
  let mode, arch, compiler;
  const variantParts = [];

  for (const part of rest) {
    if (!mode && /^(dom0|dom0less|pv|pvh|hvm)$/.test(part)) {
      mode = part;
    } else if (!arch && /^(x86(?:_64)?|arm(?:64|32)|ppc64le|riscv64)$/.test(part)) {
      arch = part;
    } else if (!compiler && /^(gcc|clang)$/.test(part)) {
      compiler = part;
    } else {
      variantParts.push(part);
    }
  }

  return {
    platform,
    testType,
    mode,
    arch,
    compiler,
    variant: variantParts.join(', ')
  };
}

async function getLatestNonScheduledPipeline(apiUrl, projectPath, maxTries = 5) {
  const query = `
    query getLatestPipeline($projectPath: ID!, $after: String) {
      project(fullPath: $projectPath) {
        pipelines(first: 1, after: $after) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            id
            iid
            source
            jobs {
              nodes {
                id
                name
                status
                stage {
                  name
                }
                detailedStatus {
                  label
                  favicon
                }
              }
            }
          }
        }
      }
    }
  `;

  let afterCursor = null;
  for (let i = 0; i < maxTries; i++) {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { projectPath, after: afterCursor } })
    });

    const data = await res.json();
    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      return null;
    }

    const page = data?.data?.project?.pipelines;
    const next = page?.pageInfo?.endCursor;
    const node = page?.nodes?.[0];

    if (!node) break;
    if (node.source !== 'schedule') return node;

    afterCursor = next;
  }
  return null;
}

async function initHardwareGrid() {
  console.log('hello cody');
  const container = document.getElementById('hardware-grid');
  if (!container) return;

  const GITLAB_API_URL = 'https://gitlab.com/api/graphql';
  const PROJECT_PATH = 'xen-project/hardware/xen';

  const pipeline = await getLatestNonScheduledPipeline(GITLAB_API_URL, PROJECT_PATH);
  if (!pipeline) return;

  const jobs = pipeline?.jobs?.nodes || [];
  const hardwareJobs = jobs
    .map(job => {
      const parsed = parseJobName(job.name);
      return { ...job, parsed };
    })
    .filter(job => job.stage?.name === 'test')
    .filter(job => job.parsed.platform !== 'qemu')
    .filter(job => job.parsed.testType !== 'suspend')
    .filter(job => job.name !== 'build-each-commit-gcc')
    .toSorted((a, b) => a.name.localeCompare(b.name));

  container.innerHTML = '';
  container.className = 'uno-section';

  // Group jobs by parsed.platform
  const groupedJobs = hardwareJobs.reduce((acc, job) => {
    const key = job.parsed.platform || 'unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(job);
    return acc;
  }, {});

  Object.entries(groupedJobs).forEach(([platform, jobs]) => {
    const heading = document.createElement('h3');
    heading.textContent = `Platform: ${platform}`;
    heading.className = 'uno-text-lg uno-font-semibold uno-mb-2 uno-mt-4';
    container.appendChild(heading);

    const groupGrid = document.createElement('div');
    groupGrid.className = 'uno-grid uno-grid-cols-2 sm:uno-grid-cols-2 md:uno-grid-cols-3 lg:uno-grid-cols-4 uno-gap-4 uno-justify-start';

    jobs.forEach(job => {
      const div = document.createElement('div');
      const style = STATUS_STYLES[job.status] || STATUS_STYLES.DEFAULT;
      div.className = clsx(
        'uno-px-3 uno-py-2 uno-rounded-lg uno-flex uno-flex-col uno-items-start uno-gap-3 uno-text-xs',
        'uno-border-0 uno-border-t-12 uno-border-brand-fill uno-border-solid',
        'uno-shadow-xl uno-shadow-gray-300 uno-bg-white uno-text-primary',
        'even:uno-animate-fade-in-left odd:uno-animate-fade-in-right'
      );
      div.innerHTML = `
        <div class="uno-flex uno-items-start uno-gap-2">
          <div class="${getHardwareIcon(job.name)} uno-text-4xl uno-flex-shrink-0" title="Hardware"></div>
          <div class="uno-flex uno-gap-1 uno-flex-wrap uno-items-center">
            ${job.parsed.arch ? `<span class="uno-bg-gray-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs uno-font-semibold">${job.parsed.arch}</span>` : ''}
            ${job.parsed.mode ? `<span class="uno-bg-green-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs">${job.parsed.mode}</span>` : ''}
            ${job.parsed.compiler ? `<span class="uno-bg-blue-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs">${job.parsed.compiler}</span>` : ''}
            ${job.parsed.variant
              ? job.parsed.variant.split(', ').map(v =>
                  `<span class="uno-bg-yellow-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs" title="Variant: ${v}">${v}</span>`
                ).join('')
              : ''
            }
          </div>
        </div>

        <div class="uno-flex uno-items-center uno-gap-2 uno-text-right uno-rounded-full uno-p-x-2 uno-p-y-1 uno-bg-secondary uno-text-white">
          <div class="${style.icon} uno-text-base ${style.color}" title="${job.status}"></div>
          <div class="">${job.detailedStatus.label}</div>
        </div>

        <details class="uno-flex uno-flex-col uno-gap-1 uno-group">
          <summary class="marker:uno-hidden uno-list-none uno-flex uno-flex-row uno-gap-2 uno-items-center uno-text-action-text hover:uno-cursor-pointer">
            <div>details</div>
            <div class="i-fa6-solid-arrow-right group-open:uno-rotate-90 uno-transition-transform uno-duration-300 uno-ease-out" title="${job.status}"></div>
          </summary>
          <div>${job.name}</div>
          <a href="https://gitlab.com/xen-project/hardware/xen/-/jobs/${job.id.split('/').pop()}" target="_blank" class="uno-text-blue-600 hover:uno-underline uno-text-xs">View job on GitLab</a>
        </details>
      `;
      groupGrid.appendChild(div);
    });

    container.appendChild(groupGrid);
  });

  if (pipeline?.id && pipeline?.iid) {
    const numericId = pipeline.id.split('/').pop();
    const link = document.createElement('a');
    link.href = `https://gitlab.com/${PROJECT_PATH}/-/pipelines/${numericId}`;
    link.textContent = 'View pipeline on GitLab';
    link.className = 'uno-block uno-mt-4 uno-text-blue-600 hover:uno-underline uno-text-sm';
    container.appendChild(link);
  }
}

initHardwareGrid();
