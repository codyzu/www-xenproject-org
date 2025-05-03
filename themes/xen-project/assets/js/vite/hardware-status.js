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

async function initHardwareGrid() {
  console.log('hello cody');
  const container = document.getElementById('hardware-grid');
  if (!container) return;

  const GITLAB_API_URL = 'https://gitlab.com/api/graphql';
  const PROJECT_PATH = 'xen-project/hardware/xen';

  const query = `
    query getLatestPipeline($projectPath: ID!) {
      project(fullPath: $projectPath) {
        pipelines(first: 1) {
          nodes {
            id
            iid
            jobs {
              nodes {
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

  const res = await fetch(GITLAB_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // Add Authorization header only if you use a token
    },
    body: JSON.stringify({ query, variables: { projectPath: PROJECT_PATH } })
  });

  const data = await res.json();
  console.log('data', data);
  if (data.errors) {
    console.error("GraphQL errors:", data.errors);
    return;
  }

  const jobs = data?.data?.project?.pipelines?.nodes?.[0]?.jobs?.nodes || [];
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
  container.className = 'uno-section uno-m-t-10';

  const grid = document.createElement('div');
  // grid.className = 'uno-flex uno-flex-wrap uno-gap-4 uno-justify-start';
  grid.className = 'uno-grid uno-grid-cols-2 sm:uno-grid-cols-2 md:uno-grid-cols-3 lg:uno-grid-cols-4 uno-gap-4 uno-justify-start';

  const pipeline = data?.data?.project?.pipelines?.nodes?.[0];
  hardwareJobs.forEach(job => {
    const div = document.createElement('div');
    const style = STATUS_STYLES[job.status] || STATUS_STYLES.DEFAULT;
    div.className = clsx(
      'uno-px-3 uno-py-2 uno-rounded-lg uno-flex uno-flex-col uno-items-start uno-gap-3 uno-text-xs',
      'uno-border-0 uno-border-t-12 uno-border-brand-fill uno-border-solid',
      'uno-shadow-xl uno-shadow-gray-300 uno-bg-white uno-text-primary',
      // style.color
    );
    div.innerHTML = `
      <div class="uno-flex uno-flex-row uno-justify-between uno-gap-2 uno-items-start">
        <div class="${getHardwareIcon(job.name)} uno-text-4xl" title="Hardware"></div>
        <div class="uno-flex-col">
          <div>Platform: <strong>${job.parsed.platform}</strong></div>
          <div>Architecture: <strong>${job.parsed.arch}</strong></div>
          ${job.parsed.mode ? `<div>Mode: <strong>${job.parsed.mode}</strong></div>` : ''}
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
      </details>
    `;
    grid.appendChild(div);
  });

  container.appendChild(grid);

  if (pipeline?.id && pipeline?.iid) {
    const numericId = pipeline.id.split('/').pop();
    const link = document.createElement('a');
    link.href = `https://gitlab.com/${PROJECT_PATH}/-/pipelines/${numericId}`;
    link.textContent = 'View on GitLab';
    link.className = 'uno-block uno-mt-4 uno-text-blue-600 hover:uno-underline uno-text-sm';
    container.appendChild(link);
  }
}

initHardwareGrid();
