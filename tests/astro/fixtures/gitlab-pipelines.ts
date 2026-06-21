import type {Page} from '@playwright/test';

function job(id: number, name: string, status = 'SUCCESS') {
  return {
    id: `gid://gitlab/Ci::Build/${id}`,
    name,
    status,
    stage: {name: 'test'},
    detailedStatus: {label: status.toLowerCase(), favicon: ''},
  };
}

function pipeline(id: number, createdAt: string, jobs: ReturnType<typeof job>[]) {
  return {
    id: `gid://gitlab/Ci::Pipeline/${id}`,
    iid: String(id),
    source: 'push',
    duration: 372,
    status: jobs.some(item => item.status === 'FAILED') ? 'FAILED' : 'SUCCESS',
    createdAt,
    detailedStatus: {label: 'passed'},
    stages: {
      nodes: [{
        name: 'test',
        groups: {nodes: [{name: 'test jobs', jobs: {nodes: jobs}}]},
      }],
    },
  };
}

const currentJobs = [
  job(111, 'adl-gcc-debug-64'),
  job(112, 'kbl-gcc-debug-64'),
  job(113, 'zen2-gcc-debug-64', 'FAILED'),
  job(222, 'qemu-smoke-x86-64'),
];

export const gitlabGraphQlResponse = {
  data: {
    project: {
      pipelines: {
        nodes: [
          pipeline(123_456, '2026-01-15T12:34:00Z', currentJobs),
          pipeline(123_455, '2026-01-14T12:34:00Z', currentJobs.map((item, index) => ({...item, id: `gid://gitlab/Ci::Build/${300 + index}`}))),
          pipeline(123_454, '2026-01-13T12:34:00Z', currentJobs.map((item, index) => ({...item, id: `gid://gitlab/Ci::Build/${400 + index}`}))),
        ],
      },
    },
  },
};

export const gitlabEmptyPipelinesResponse = {
  data: {project: {pipelines: {nodes: []}}},
};

export const gitlabEmptyJobsResponse = {
  data: {project: {pipelines: {nodes: [pipeline(123_456, '2026-01-15T12:34:00Z', [])]}}},
};

export async function mockGitlabGraphQl(page: Page, payload: unknown = gitlabGraphQlResponse) {
  await page.route('https://gitlab.com/api/graphql', async route => {
    await route.fulfill({contentType: 'application/json', json: payload});
  });
}
