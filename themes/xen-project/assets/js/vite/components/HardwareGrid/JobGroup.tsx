import { h, Fragment } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import clsx from 'clsx';
import { ParsedJob } from './schema';

const statusStyles = {
  SUCCESS: {
    icon: 'i-fa6-solid:circle-check',
    color: 'uno-text-green-500',
  },
  FAILED: {
    icon: 'i-fa6-solid:circle-xmark',
    color: 'uno-text-red-500',
  },
  CREATED: {
    icon: 'i-fa6-solid-hourglass-half',
    color: 'uno-text-yellow-500',
  },
  PENDING: {
    icon: 'i-fa6-solid-hourglass-half',
    color: 'uno-text-yellow-500',
  },
  RUNNING: {
    icon: 'i-fa6-solid-hourglass-half',
    color: 'uno-text-yellow-500',
  },
  DEFAULT: {
    icon: 'i-fa6-solid-circle-question',
    color: 'uno-text-gray-500',
  },
};

type StatusType = keyof typeof statusStyles;

export default function JobGroup({ platform, jobs, index }: { platform: string; jobs: ParsedJob[]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const groupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (groupRef.current) {
      observer.observe(groupRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div class="embla__slide uno-flex-[0_0_100%] sm:uno-flex-[0_0_30rem] uno-min-w-0 uno-p-l-4 uno-flex">
      <div class="uno-card uno-grid uno-grid-cols-[1fr_auto] uno-content-start uno-auto-rows-auto uno-items-center uno-gap-1 uno-w-full">
        <div class="uno-text-2xl uno-font-semibold">{platform}</div>
        <div class="uno-flex uno-flex-col uno-gap-2 uno-items-center">
          {jobs[0].parsed.icons.map(icon => (
            <div key={icon} class=" uno-border-1 uno-border-secondary uno-rounded-lg uno-border-solid uno-border uno-shadow-xl uno-shadow-gray-300 uno-p-1">
              <div class={clsx(icon, 'uno-text-6xl uno-flex-shrink-0 uno-text-secondary')} />
            </div>
          ))}
        </div>
    
        <div class="uno-grid-col-span-2 uno-text-lg uno-font-semibold">Jobs:</div>
        {jobs.map(job => {
          const style = statusStyles[job.status as StatusType] || statusStyles.DEFAULT;
          return (
            <Fragment key={job.id}>
              <a href={`https://gitlab.com/xen-project/hardware/xen/-/jobs/${job.id.split('/').pop()}`} target="_blank" class="uno-text-blue-600 hover:uno-underline uno-text-xs uno-flex-1">
                {job.name}
              </a>
              <div class="uno-flex uno-items-center uno-gap-2 uno-text-right uno-rounded-full uno-p-x-1 uno-p-r-2 uno-p-y-1 uno-bg-secondary uno-text-white">
                <div class={clsx(style.icon, style.color, 'uno-text-base')} title={job.status}></div>
                <div class="uno-text-xs">{job.detailedStatus.label}</div>
              </div>
            </Fragment>
          )}
        )}
      </div>
    </div>
  );
}
