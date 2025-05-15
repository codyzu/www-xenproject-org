import {h, render, type RefObject} from 'preact';
import {useEffect, useState, useLayoutEffect, useRef} from 'preact/hooks';
import useEmblaCarousel from 'embla-carousel-react';
import clsx from 'clsx';
import Globe, {type GlobeMethods} from 'react-globe.gl';
import useResizeObserver from '@react-hook/resize-observer';
import ButtonBase from '../ButtonBase.tsx';
import ButtonExternalLink from '../ButtonExternalLink.tsx';
import {graphQlResponseSchema, type Pipeline, type ParsedJob} from './schema.ts';
import JobGroup from './JobGroup.tsx';
import {parseJobName} from './parse-job-name.ts';
import {DotButton, useDotButton} from './CarouselButtons.tsx';

async function getLatestNonScheduledPipeline(apiUrl: string, projectPath: string): Promise<Pipeline | undefined> {
  const query = `
    query getLatestPipeline($projectPath: ID!, $branch: String!) {
      project(fullPath: $projectPath) {
        pipelines(ref: $branch, first: 1, source: "push") {
          nodes {
            id iid source
            createdAt
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

  const response: Response = await fetch(apiUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables: {projectPath, branch: 'staging'}}),
  });

  const json: unknown = await response.json();

  // Validate the response using Zod
  const parsed = graphQlResponseSchema.safeParse(json);
  if (!parsed.success) {
    // Log validation errors for debugging
    console.error('GraphQL response validation failed:', parsed.error);
    return;
  }

  const node = parsed.data.data.project?.pipelines?.nodes?.[0];

  if (!node) {
    console.warn('No pipeline found');
  }

  return node;
}

const useSize = (target: RefObject<HTMLDivElement>) => {
  const [size, setSize] = useState<DOMRect>();

  useLayoutEffect(() => {
    if (target.current === null) {
      return;
    }

    setSize(target.current.getBoundingClientRect());
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => {
    setSize(entry.contentRect);
  });
  return size;
};

type MarkerData = {
  readonly lat: number;
  readonly lng: number;
  readonly text: string;
  readonly details: string;
};

function Marker({text, details}: MarkerData) {
  return (
    <div className="uno-bg-gray uno-border-solid uno-border-1 uno-border-brand-fill uno-bg-opacity-60 uno-rounded-xl uno-p-2">
      <div className="uno-w-10 uno-h-10 i-mdi-cpu-64-bit" />
      <div className="uno-text-xs uno-font-semibold">{text}</div>
      <div className="uno-text-xs uno-font-mono">{details}</div>
    </div>
  );
}

const sanJose = {lat: 37.3382, lng: -121.8863};
const grenoble = {lat: 45.1885, lng: 5.7245};
const boston = {lat: 42.3601, lng: -71.0589};
const amsterdam = {lat: 52.3676, lng: 4.9041};

const cities = [sanJose, grenoble, boston, amsterdam];

const combinations = cities.flatMap((start, startIndex) =>
  cities.filter((end, endIndex) => start !== end && endIndex > startIndex).map((end) => ({start, end})),
);
const arcsData = combinations.map(({start, end}) => ({
  startLat: start.lat,
  startLng: start.lng,
  endLat: end.lat,
  endLng: end.lng,
  color: 'red',
}));

const N = 30;
const gData: MarkerData[] = [
  {
    ...sanJose,
    text: 'San Jose',
    details: `Xen Project number San Jose`,
  },
  {
    ...grenoble,
    text: 'Grenoble',
    details: `Xen Project number Grenoble`,
  },
  {
    ...boston,
    text: 'Boston',
    details: `Xen Project number Boston`,
  },
  {
    ...amsterdam,
    text: 'Amsterdam',
    details: `Xen Project number Amsterdam`,
  },
];

export function HardwareGrid() {
  const [pipeline, setPipeline] = useState<Pipeline>();
  const [jobs, setJobs] = useState<Map<string, ParsedJob[]>>(new Map());
  const [pipelineDate, setPipelineDate] = useState<Date>(() => new Date());
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeContainerSize = useSize(globeContainerRef);
  const globeRef = useRef<GlobeMethods>();

  useEffect(() => {
    if (!globeRef.current) {
      return;
    }

    // Auto-rotate
    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 0.8;
  }, [globeRef]);

  useEffect(() => {
    const load = async () => {
      const gitlabApi = 'https://gitlab.com/api/graphql';
      const projectPath = 'xen-project/hardware/xen';
      const pipeline = await getLatestNonScheduledPipeline(gitlabApi, projectPath);
      if (!pipeline) return;

      // Store the raw Date object in state
      setPipelineDate(new Date(pipeline.createdAt));

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

      if (parsedJobs.length === 0) {
        console.warn('No jobs found');
      }

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

  console.log('globeSize', globeContainerSize);

  return (
    <div
      className={clsx(
        'uno-flex uno-flex-col uno-max-w-[1472px] uno-w-full uno-relative uno-m-x-auto',
        jobs.size === 0 && ' uno-blur-sm uno-animate-pulse uno-pointer-events-none uno-touch-none',
      )}
    >
      <div ref={globeContainerRef} className="uno-h-120 uno-w-full uno-flex uno-flex-col uno-items-center">
        {globeContainerSize ? (
          <Globe
            ref={globeRef}
            globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg"
            width={globeContainerSize.width}
            height={globeContainerSize.height}
            htmlElementsData={gData}
            htmlElement={(d) => {
              const data = d as MarkerData;
              const element = document.createElement('div');
              render(<Marker {...data} />, element);
              return element;
            }}
            arcsData={arcsData}
            arcStroke={2}
            arcAltitudeAutoScale={0.25}
            arcColor={['#f87171', '#fbbf24', '#4ade80', '#fbbf24', '#f87171']}
            backgroundColor="#ededed"
          />
        ) : null}
      </div>
      <div className="uno-flex uno-flex-wrap uno-items-center uno-gap-x-2 uno-justify-center uno-text-center uno-text-sm uno-font-semibold uno-m-b-4">
        <div>Test pipeline triggered at:</div>
        <div className="uno-font-mono">
          {pipelineDate.toISOString().split('T')[0]} {pipelineDate.toISOString().split('T')[1].slice(0, 5)} (UTC)
        </div>
      </div>
      <div ref={emblaRef} className="embla uno-w-full uno-overflow-hidden uno-relative">
        <div className="embla__container uno-flex uno-p-b-8 uno-m-l--4">
          {jobs.size === 0
            ? Array.from({length: 6}).map((_, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="uno-flex-[0_0_100%] sm:uno-flex-[0_0_30rem] uno-min-w-0 uno-p-l-4 uno-flex"
                >
                  <div className="uno-card uno-h-[29rem] uno-w-full">
                    <div className="uno-text-2xl uno-font-semibold uno-m-t-14">Loading Architecture</div>
                  </div>
                </div>
              ))
            : [...jobs.entries()].map(([platform, jobs], index) => (
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
          href={`https://gitlab.com/xen-project/hardware/xen/-/pipelines/${pipeline?.id?.split('/')?.pop() ?? ''}`}
          class="uno-self-center sm:uno-self-start"
        >
          View Pipeline on GitLab
        </ButtonExternalLink>
      </div>
    </div>
  );
}
