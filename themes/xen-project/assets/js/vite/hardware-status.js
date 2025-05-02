// static/js/hardware-status.js
import clsx from "clsx";

const STATUS_STYLES = {
  SUCCESS: {
    icon: "i-fa6-solid:circle-check",
    color: "uno-bg-green-100 uno-text-green-800"
  },
  FAILED: {
    icon: "i-fa6-solid:circle-xmark",
    color: "uno-bg-red-100 uno-text-red-800"
  },
  CREATED: {
    icon: "i-fa6-solid-hourglass-half",
    color: "uno-bg-yellow-100 uno-text-yellow-800"
  },
  PENDING: {
    icon: "i-fa6-solid-hourglass-half",
    color: "uno-bg-yellow-100 uno-text-yellow-800"
  },
  RUNNING: {
    icon: "i-fa6-solid-hourglass-half",
    color: "uno-bg-yellow-100 uno-text-yellow-800"
  },
  DEFAULT: {
    icon: "i-fa6-solid-circle-question",
    color: "uno-bg-gray-100 uno-text-gray-800"
  }
};

const HARDWARE_ICONS = {
  ampere: 'i-mdi-cpu-64-bit',
  pi: 'i-simple-icons-raspberrypi',
  rockchip: 'i-mdi-chip',
  intel: 'i-mdi-desktop-classic',
  arm: 'i-mdi-robot',
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

const getDisplayName = (jobName) => {
  return jobName
    .replace(/^xilinx-smoke-/, '')
    .replace(/-gcc(-debug)?$/, '')
    .replace(/^(zen3|pi|ampere|rockchip|x86|arm|intel)[^-]*-/, '')
    .slice(0, 30); // limit to 30 chars
};

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
  const hardwareJobs = jobs.filter(j =>
    j.stage?.name === 'test' &&
    !j.name.toLowerCase().includes('qemu') &&
    !j.name.toLowerCase().includes('suspend') &&
    j.name !== 'build-each-commit-gcc'
  ).toSorted((a, b) => a.name.localeCompare(b.name));

  container.innerHTML = '';
  container.className = 'uno-section uno-m-t-10';

  const grid = document.createElement('div');
  grid.className = 'uno-flex uno-flex-wrap uno-gap-4 uno-justify-start';

  const pipeline = data?.data?.project?.pipelines?.nodes?.[0];
  hardwareJobs.forEach(job => {
    const div = document.createElement('div');
    const style = STATUS_STYLES[job.status] || STATUS_STYLES.DEFAULT;
    div.className = clsx(
      'uno-px-3 uno-py-2 uno-rounded-lg uno-shadow uno-flex uno-items-start uno-gap-3 uno-text-xs uno-w-[260px] uno-min-h-[64px]',
      style.color
    );
    div.innerHTML = `
      <div class="${getHardwareIcon(job.name)} uno-text-lg" title="Hardware"></div>
      <div class="uno-flex-1 uno-text-left uno-whitespace-normal">${getDisplayName(job.name)}</div>
      <div class="uno-flex uno-items-center uno-gap-1 uno-text-right">
        <div class="${style.icon} uno-text-base" title="${job.status}"></div>
        <div class="uno-hidden sm:uno-inline">${job.detailedStatus.label}</div>
      </div>
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
