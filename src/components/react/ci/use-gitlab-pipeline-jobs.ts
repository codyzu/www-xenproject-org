import {useEffect, useState} from 'react';
import {graphQlResponseSchema, type Pipeline, type Job as RawJob} from './schema.ts';
import {type JobData, type Location, parseJobData} from './gitlab-jobs.ts';

export type Job = {
  raw: RawJob;
} & JobData;

export type PipelineJobsResult = {
  pipeline: Pipeline;
  jobs: Job[];
  pipelineDate: Date;
};

export type JobWithLocation = Job & {
  location: Location;
};

export type JobLocation = {
  jobs: JobWithLocation[];
  status: string;
  location: Location;
};

type PipelineResult =
  | {
      readonly loading: true;
      readonly error: undefined;
      readonly pipelines: undefined;
    }
  | {
      readonly loading: false;
      readonly error: string;
      readonly pipelines: undefined;
    }
  | {
      readonly loading: false;
      readonly error: undefined;
      readonly pipelines: PipelineJobsResult[];
    };

export function useGitlabPipelineJobs(count = 1): PipelineResult {
  const apiUrl = 'https://gitlab.com/api/graphql';
  const projectPath = 'xen-project/hardware/xen';
  const [state, setState] = useState<PipelineJobsResult[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function getLatestNonScheduledPipelines(
      apiUrl: string,
      projectPath: string,
      count: number,
    ): Promise<Pipeline[] | undefined> {
      const query = `
        query getLatestPipelines($projectPath: ID!, $branch: String!, $count: Int!) {
          project(fullPath: $projectPath) {
            pipelines(ref: $branch, first: $count, source: "push") {
              nodes {
                id iid source
                duration
                status
                createdAt
                detailedStatus {
                  label
                }
                stages {
                  nodes {
                    name
                    groups {
                      nodes {
                        name
                        jobs {
                          nodes {
                            id
                            name
                            status
                            stage { name }
                            detailedStatus { label favicon }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response: Response = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query, variables: {projectPath, branch: 'staging', count}}),
      });

      if (!response.ok) {
        throw new Error(`GitLab API returned ${response.status}`);
      }

      const json: unknown = await response.json();
      console.log('GraphQL response:', json);
      const parsed = graphQlResponseSchema.safeParse(json);

      if (!parsed.success) {
        console.error('GraphQL response validation failed:', parsed.error);
        throw new Error('GraphQL response validation failed');
      }

      const nodes = parsed.data.data.project?.pipelines?.nodes;
      return nodes ?? [];
    }

    setLoading(true);
    setError(undefined);
    const load = async () => {
      try {
        const pipelines = await getLatestNonScheduledPipelines(apiUrl, projectPath, count);
        if (!pipelines) return;
        const results: PipelineJobsResult[] = pipelines.map((pipeline) => {
          const pipelineDate = new Date(pipeline.createdAt);
          const jobs: RawJob[] = (pipeline.stages?.nodes ?? [])
            .filter((stage) => stage.name === 'test')
            .flatMap((stage) => stage.groups?.nodes ?? [])
            .flatMap((group) => group.jobs?.nodes ?? []);
          const parsedJobs: Job[] = jobs
            .filter((j) => j.name !== 'build-each-commit-gcc')
            .map((j) => {
              const jobData = parseJobData(j.name);
              return {raw: j, ...jobData};
            })
            .filter((j) => Boolean(j.platform))
            .sort((a, b) => a.platform.localeCompare(b.platform));
          return {pipeline, jobs: parsedJobs, pipelineDate};
        });
        setState(results);
      } catch (error_) {
        console.error('Error fetching pipelines:', error_);
        setError((error_ as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [apiUrl, projectPath, count]);

  if (loading) {
    return {loading: true, error: undefined, pipelines: undefined};
  }

  if (error) {
    return {loading: false, error, pipelines: undefined};
  }

  if (!state) {
    // Should never happen
    throw new Error('State is undefined');
  }

  return {pipelines: state, loading: false, error: undefined};
}

export function getJobGroupStatus(jobs: Job[]): string {
  const statuses = new Set(jobs.map((j) => j.raw.status).filter((j) => j !== 'SKIPPED' && j !== 'CANCELED'));

  const status =
    // If only success, then set as success
    statuses.size === 1 && statuses.has('SUCCESS')
      ? 'SUCCESS'
      : // In order of priority, choose the best status
        statuses.has('FAILED')
        ? 'FAILED'
        : statuses.has('PENDING')
          ? 'PENDING'
          : statuses.has('RUNNING')
            ? 'RUNNING'
            : 'UNKNOWN';
  return status;
}
