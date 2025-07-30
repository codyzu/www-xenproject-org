import useEmblaCarousel from 'embla-carousel-react';
import clsx from 'clsx';
import ButtonBase from '../ButtonBase.tsx';
import ButtonExternalLink from '../ButtonExternalLink.tsx';
import {type Job, useGitlabPipelineJobs} from './use-gitlab-pipeline-jobs.ts';
import JobGroup from './JobGroup.tsx';
import {DotButton, useDotButton} from './CarouselButtons.tsx';

export default function HardwareGrid() {
  const {pipelines, loading, error} = useGitlabPipelineJobs(1);

  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true});
  const {selectedIndex, scrollSnaps, onDotButtonClick} = useDotButton(emblaApi);

  const {jobs, pipelineDate, pipeline} = pipelines?.[0] ?? {};

  const date = pipelineDate ?? new Date();

  const jobsByPlatform = new Map<string, Job[]>();
  for (const job of jobs ?? []) {
    const {platform} = job;
    jobsByPlatform.set(platform, [...(jobsByPlatform.get(platform) ?? []), job]);
  }

  return (
    <div
      className={clsx(
        'uno-flex uno-flex-col uno-max-w-[1472px] uno-w-full uno-relative uno-m-x-auto',
        (loading || error) && ' uno-blur-sm uno-animate-pulse uno-pointer-events-none uno-touch-none',
      )}
    >
      <div className="uno-flex uno-flex-wrap uno-items-center uno-gap-x-2 uno-justify-center uno-text-center uno-text-sm uno-font-semibold uno-m-b-4">
        <div>Test pipeline triggered at:</div>
        <div className="uno-font-mono">
          {date.toISOString().split('T')[0]} {date.toISOString().split('T')[1].slice(0, 5)} (UTC)
        </div>
      </div>
      <div ref={emblaRef} className="embla uno-w-full uno-overflow-hidden uno-relative">
        <div className="embla__container uno-flex uno-p-b-8 uno-m-l--4">
          {!loading && !error
            ? [...jobsByPlatform.entries()].map(([platform, jobs], index) => (
                <JobGroup key={platform} platform={platform} jobs={jobs} />
              ))
            : Array.from({length: 6}).map((_, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="uno-flex-[0_0_100%] sm:uno-flex-[0_0_30rem] uno-min-w-0 uno-p-l-4 uno-flex"
                >
                  <div className="uno-card uno-shadow-gray-300 uno-h-[29rem] uno-w-full">
                    <div className="uno-text-2xl uno-font-semibold uno-m-t-14">Loading Architecture</div>
                  </div>
                </div>
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
