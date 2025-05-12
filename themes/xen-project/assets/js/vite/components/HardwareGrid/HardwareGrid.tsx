import {h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import useEmblaCarousel from 'embla-carousel-react';
import ButtonBase from '../ButtonBase.tsx';
import ButtonExternalLink from '../ButtonExternalLink.tsx';
import {graphQlResponseSchema, type Pipeline, type ParsedJob} from './schema.ts';
import JobGroup from './JobGroup.tsx';
import {parseJobName} from './parse-job-name.ts';
import {DotButton, useDotButton} from './CarouselButtons.tsx';

async function getLatestNonScheduledPipeline(
  apiUrl: string,
  projectPath: string,
  maxTries = 5,
): Promise<Pipeline | undefined> {
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
    // eslint-disable-next-line no-await-in-loop
    const response: Response = await fetch(apiUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query, variables: {projectPath, after: afterCursor}}),
    });
    // eslint-disable-next-line no-await-in-loop
    const json: unknown = await response.json();

    console.log('GraphQL response:', json);

    // Validate the response using Zod
    const parsed = graphQlResponseSchema.safeParse(json);
    if (!parsed.success) {
      console.error('Invalid GraphQL response:', parsed.error);
      return;
    }

    const page = parsed.data.data.project?.pipelines;
    const node = page?.nodes?.[0];
    if (!node) break;
    if (node.source !== 'schedule') return node;
    afterCursor = page?.pageInfo?.endCursor;
  }
}

export function HardwareGrid() {
  const [pipeline, setPipeline] = useState<Pipeline>();
  const [jobs, setJobs] = useState<Map<string, ParsedJob[]>>(new Map());

  useEffect(() => {
    const load = async () => {
      const gitlabApi = 'https://gitlab.com/api/graphql';
      const projectPath = 'xen-project/hardware/xen';
      const pipeline = await getLatestNonScheduledPipeline(gitlabApi, projectPath);
      if (!pipeline) return;

      const parsedJobs = (pipeline.jobs.nodes || [])
        .filter((j) => j.stage?.name === 'test')
        .filter((j) => !j.name.startsWith('qemu'))
        .filter((j) => j.name !== 'build-each-commit-gcc')
        .map((j) => {
          const parsed = parseJobName(j.name);
          if (!parsed) {
            console.warn(`Unable to parse job name: ${j.name}`);
            return;
          }

          return {...j, parsed};
        })
        .filter((j) => j !== undefined)
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

    void load();
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true});
  const {selectedIndex, scrollSnaps, onDotButtonClick} = useDotButton(emblaApi);

  if (!pipeline) {
    return null;
  }

  return (
    <div className="uno-flex uno-flex-col uno-max-w-[1472px] uno-w-full uno-relative uno-m-x-auto">
      <div ref={emblaRef} className="embla uno-w-full uno-overflow-hidden uno-relative">
        <div className="embla__container uno-flex uno-p-b-8 uno-m-l--4">
          {[...jobs.entries()].map(([platform, jobs], index) => (
            <JobGroup key={platform} platform={platform} jobs={jobs} index={index} />
          ))}
        </div>
        <div className="uno-hidden sm:uno-absolute uno-left-0 uno-top-0 uno-w-[5rem] uno-h-full uno-bg-gradient-to-r uno-from-surface-secondary uno-flex uno-flex-col uno-justify-center uno-items-center uno-pointer-events-none uno-touch-none" />
        <div className="uno-hidden sm:uno-absolute uno-right-0 uno-top-0 uno-w-[5rem] uno-h-full uno-bg-gradient-to-l uno-from-surface-secondary uno-flex uno-flex-col uno-justify-center uno-items-center uno-pointer-events-none uno-touch-none" />
      </div>
      <div className="uno-flex uno-flex-col uno-max-w-[1312px] uno-m-x-auto uno-relative uno-w-full uno-m-t--2 uno-gap-10">
        <div className="uno-flex uno-flex-row-reverse uno-gap-4 uno-justify-center sm:uno-justify-start uno-flex-wrap sm:uno-flex-nowrap">
          <div className="uno-flex uno-gap-2 uno-w-full sm:uno-w-auto uno-items-center uno-justify-center">
            {scrollSnaps.map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <DotButton key={index} index={index} selectedIndex={selectedIndex} onDotButtonClick={onDotButtonClick} />
            ))}
          </div>
          <div className="uno-hidden sm:uno-flex uno-flex-grow" />
          <ButtonBase
            class="uno-touch-manipulation"
            icon="i-fa6-solid-arrow-right"
            iconPosition="right"
            onClick={() => emblaApi?.scrollNext()}
          >
            Next
          </ButtonBase>
          <ButtonBase
            class="uno-touch-manipulation"
            icon="i-fa6-solid-arrow-left"
            iconPosition="left"
            onClick={() => emblaApi?.scrollPrev()}
          >
            Prev
          </ButtonBase>
        </div>
        <ButtonExternalLink
          href={`https://gitlab.com/xen-project/hardware/xen/-/pipelines/${pipeline.id.split('/').pop()}`}
          class="uno-self-center sm:uno-self-start"
        >
          View Pipeline on GitLab
        </ButtonExternalLink>
      </div>
    </div>
  );
}
