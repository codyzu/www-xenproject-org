import {useEffect, useState} from 'preact/hooks';
import {graphQlResponseSchema, type Pipeline, type ParsedJob, type Job as RawJob} from './schema.ts';
import {parseJobName} from './parse-job-name.ts';
import {type JobData, parseJobData} from './gitlab-jobs.ts';

export type Job = {
  raw: RawJob;
} & JobData;

type PipelineResult =
  | {
      readonly loading: true;
      readonly error: undefined;
      readonly pipeline: undefined;
      readonly jobs: undefined;
      readonly pipelineDate: undefined;
    }
  | {
      readonly loading: false;
      readonly error: string;
      readonly pipeline: undefined;
      readonly jobs: undefined;
      readonly pipelineDate: undefined;
    }
  | {
      readonly loading: false;
      readonly error: undefined;
      readonly pipeline: Pipeline;
      readonly jobs: Job[];
      readonly pipelineDate: Date;
    };

export function useGitlabPipelineJobs(): PipelineResult {
  const apiUrl = 'https://gitlab.com/api/graphql';
  const projectPath = 'xen-project/hardware/xen';
  const [state, setState] = useState<{
    pipeline: Pipeline;
    jobs: Job[];
    pipelineDate: Date;
  }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function getLatestNonScheduledPipeline(apiUrl: string, projectPath: string): Promise<Pipeline | undefined> {
      const query = `
        query getLatestPipeline($projectPath: ID!, $branch: String!) {
          project(fullPath: $projectPath) {
            pipelines(ref: $branch, first: 1, source: "push") {
              nodes {
                id iid source
                duration
                status
                createdAt
                detailedStatus {
                  label
                }
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
        }
      `;

      const response: Response = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query, variables: {projectPath, branch: 'staging'}}),
      });

      const json: unknown = await response.json();
      console.log('GraphQL response:', json);
      const parsed = graphQlResponseSchema.safeParse(json);
      if (!parsed.success) {
        console.error('GraphQL response validation failed:', parsed.error);
        setError('GraphQL response validation failed');
        return;
      }

      const node = parsed.data.data.project?.pipelines?.nodes?.[0];
      if (!node) {
        setError('No pipeline found');
      }

      return node;
    }

    setLoading(true);
    setError(undefined);
    const load = async () => {
      try {
        const pipeline = await getLatestNonScheduledPipeline(apiUrl, projectPath);
        if (!pipeline) return;
        const pipelineDate = new Date(pipeline.createdAt);
        const parsedJobs = (pipeline.jobs.nodes || [])
          .filter((j) => j.stage?.name === 'test')
          .filter((j) => !j.name.startsWith('qemu'))
          .filter((j) => j.name !== 'build-each-commit-gcc')
          .map((j) => {
            const jobData = parseJobData(j.name);
            return {raw: j, ...jobData};
            // Const parsed = parseJobName(j.name);
            // if (!parsed) {
            //   console.warn(`Unable to parse job name: ${j.name}`);
            //   return;
            // }

            // return {...j, parsed};
          })
          .filter((j) => Boolean(j.platform))
          // .filter((j) => j !== undefined)
          .sort((a, b) => a.platform.localeCompare(b.platform));

        setState({pipeline, jobs: parsedJobs, pipelineDate});
      } catch (error_) {
        setError((error_ as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [apiUrl, projectPath]);

  if (loading) {
    return {loading: true, error: undefined, pipeline: undefined, jobs: undefined, pipelineDate: undefined};
  }

  if (error) {
    return {loading: false, error, pipeline: undefined, jobs: undefined, pipelineDate: undefined};
  }

  if (!state) {
    // Should never happen
    throw new Error('State is undefined');
  }

  return {...state, loading: false, error: undefined};
}
