import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { GraphQLResponseSchema, ParsedJob } from './schema';
import JobGroup from './JobGroup';
import { parseJobName } from './parse-job-name';

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

    console.log('GraphQL response:', json);

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

export function HardwareGrid() {
  const [pipeline, setPipeline] = useState<any>(null);
  const [jobs, setJobs] = useState<Map<string, ParsedJob[]>>(new Map());

  useEffect(() => {
    const load = async () => {
      const API = 'https://gitlab.com/api/graphql';
      const PATH = 'xen-project/hardware/xen';
      const pipeline = await getLatestNonScheduledPipeline(API, PATH);
      if (!pipeline) return;

      const parsedJobs = (pipeline.jobs.nodes || [])
        .filter(j => j.stage?.name === 'test')
        .filter(j => !j.name.startsWith('qemu'))
        .filter(j => j.name !== 'build-each-commit-gcc')
        .map(j => {
          const parsed = parseJobName(j.name);
          if (!parsed) {
            console.warn(`Unable to parse job name: ${j.name}`);
            return;
          }

          return ({ ...j, parsed: parseJobName(j.name) } as ParsedJob);
        })
        .filter(j => j !== undefined)
        .sort((a, b) => a.name.localeCompare(b.name));

      // Group jobs by architecture
      const archJobs = new Map<string, ParsedJob[]>();
      for (const job of parsedJobs) {
        const platform = job.parsed.friendlyPlatform;
        archJobs.set(platform, [...(archJobs.get(platform) ?? []), job]);
      }

      setPipeline(pipeline);
      setJobs(archJobs);
    };
    load();
  }, []);

  return (
    <div class="uno-section-nested">
      {Array.from(jobs.entries()).map(([platform, jobs], index) => (
        <JobGroup key={platform} platform={platform} jobs={jobs} index={index} />
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