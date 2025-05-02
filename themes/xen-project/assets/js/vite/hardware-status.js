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
  intel: 'i-fa6-solid-microchip',
  unknown: 'i-mdi-help-box'
};

const getHardwareIcon = (jobName) => {
  const name = jobName.toLowerCase();
  if (name.includes('ampere')) return HARDWARE_ICONS.ampere;
  if (name.includes('pi')) return HARDWARE_ICONS.pi;
  if (name.includes('rockchip')) return HARDWARE_ICONS.rockchip;
  if (name.includes('x86') || name.includes('intel')) return HARDWARE_ICONS.intel;
  return HARDWARE_ICONS.unknown;
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
  const jobs = data?.data?.project?.pipelines?.nodes?.[0]?.jobs?.nodes || [];
  const hardwareJobs = jobs.filter(j =>
    j.stage?.name === 'test' && !j.name.toLowerCase().includes('qemu')
  ).toSorted((a, b) => a.name.localeCompare(b.name));

  container.innerHTML = '';
  container.className = 'uno-flex uno-flex-wrap uno-gap-4 uno-justify-start uno-p-8';
  hardwareJobs.forEach(job => {
    const div = document.createElement('div');
    const style = STATUS_STYLES[job.status] || STATUS_STYLES.DEFAULT;
    div.className = clsx(
      'uno-p-4 uno-rounded-xl uno-text-center uno-shadow uno-hover:scale-105 uno-transition-all uno-w-[200px]',
      style.color
    );
    div.innerHTML = `
      <h3 class="uno-font-bold uno-text-sm uno-mb-2">${job.name}</h3>
      <div class="${getHardwareIcon(job.name)} uno-text-3xl uno-mb-1"></div>
      <div class="${style.icon} uno-text-2xl uno-mb-1" title="${job.status}"></div>
      <p class="uno-text-xs">${job.detailedStatus.label}</p>
    `;
    container.appendChild(div);
  });
}

initHardwareGrid();
