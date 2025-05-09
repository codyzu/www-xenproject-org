import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { GraphQLResponseSchema, ParsedJob } from './schema';
import JobGroup from './JobGroup';
import { parseJobName } from './parse-job-name';
import useEmblaCarousel from 'embla-carousel-react';
import ButtonBase from '../ButtonBase';
import ButtonExternalLink from '../ButtonExternalLink';
import { DotButton, useDotButton } from './CarouselButtons';

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

  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true})
  const {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  } = useDotButton(emblaApi);

  if (!pipeline) {
    return null;
  }

  return (
    <div class="uno-flex uno-flex-col uno-max-w-[1472px] uno-w-full uno-relative uno-m-x-auto">
      <div class="embla uno-w-full uno-overflow-hidden uno-relative" ref={emblaRef}>
        <div class="embla__container uno-flex uno-p-b-8 uno-m-l--4">
          {Array.from(jobs.entries()).map(([platform, jobs], index) => (
            <JobGroup key={platform} platform={platform} jobs={jobs} index={index} />
          ))}
        </div>
        <div class="uno-hidden sm:uno-absolute uno-left-0 uno-top-0 uno-w-[5rem] uno-h-full uno-bg-gradient-to-r uno-from-surface-secondary uno-flex uno-flex-col uno-justify-center uno-items-center uno-pointer-events-none uno-touch-none" />
        <div class="uno-hidden sm:uno-absolute uno-right-0 uno-top-0 uno-w-[5rem] uno-h-full uno-bg-gradient-to-l uno-from-surface-secondary uno-flex uno-flex-col uno-justify-center uno-items-center uno-pointer-events-none uno-touch-none" />
      </div>
      <div class="uno-flex uno-flex-col uno-max-w-[1312px] uno-m-x-auto uno-relative uno-w-full uno-m-t--2 uno-gap-10">
        <div class="uno-flex uno-flex-row-reverse uno-gap-4 uno-justify-center sm:uno-justify-start uno-flex-wrap sm:uno-flex-nowrap">
        <div class="uno-flex uno-gap-2 uno-items-center uno-justify-self-end">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                index={index}
                selectedIndex={selectedIndex}
                onDotButtonClick={onDotButtonClick}
            />
            ))} 
          </div>
          <div class="uno-hidden sm:uno-flex uno-flex-grow" />
          <ButtonBase icon="i-fa6-solid-arrow-right" iconPosition="right" onClick={() => emblaApi?.scrollNext()}>Next</ButtonBase>
          <ButtonBase icon="i-fa6-solid-arrow-left" iconPosition="left" onClick={() => emblaApi?.scrollPrev()}>Prev</ButtonBase>
        </div>
        <ButtonExternalLink
            href={`https://gitlab.com/xen-project/hardware/xen/-/pipelines/${pipeline.id.split('/').pop()}`}
            class="uno-self-start"
          >View Pipeline on GitLab</ButtonExternalLink>
      </div>
    </div>
  );
}