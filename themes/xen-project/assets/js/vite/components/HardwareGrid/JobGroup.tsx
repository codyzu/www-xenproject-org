import { h } from 'preact';
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
    <div
      ref={groupRef}
      data-platform={platform}
      class={clsx(
        'uno-opacity-0 uno-animate-fill-forwards',
        isVisible &&
          (index % 2 === 0
            ? 'uno-animate-fade-in-left-short'
            : 'uno-animate-fade-in-right-short')
      )}
    >
      <h3 class="uno-text-lg uno-font-semibold uno-mb-2 uno-mt-4">{platform}</h3>
      <div class="uno-grid uno-grid-cols-2 sm:uno-grid-cols-2 md:uno-grid-cols-3 lg:uno-grid-cols-4 uno-gap-4 uno-justify-start">
        {jobs.map(job => {
          const style = statusStyles[job.status as StatusType] || statusStyles.DEFAULT;
          return (
            <div
              class={clsx(
                'uno-px-3 uno-py-2 uno-rounded-lg uno-flex uno-flex-col uno-items-start uno-gap-3 uno-text-xs',
                'uno-border-0 uno-border-t-12 uno-border-brand-fill uno-border-solid',
                'uno-shadow-xl uno-shadow-gray-300 uno-bg-white uno-text-primary'
              )}
            >
              <div class="uno-flex uno-items-start uno-gap-2">
                {job.parsed.icons.map(icon => (<div key={icon} class={clsx(icon, 'uno-text-4xl uno-flex-shrink-0 uno-text-secondary')} />))}
                <div class="uno-flex uno-gap-1 uno-flex-wrap uno-items-center">
                  <span class="uno-bg-gray-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs uno-font-semibold">{job.parsed.arch}</span>
                  {job.parsed.compiler && <span class="uno-bg-blue-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs">{job.parsed.compiler}</span>}
                  {job.parsed.variant && job.parsed.variant.map(v => (
                    <span class="uno-bg-yellow-100 uno-px-2 uno-py-0.5 uno-rounded uno-text-xs" title={`Variant: ${v}`}>{v}</span>
                  ))}
                </div>
              </div>
              <div class="uno-flex uno-items-center uno-gap-2 uno-text-right uno-rounded-full uno-p-x-1 uno-p-r-2 uno-p-y-1 uno-bg-secondary uno-text-white">
                <div class={`${style.icon} uno-text-base ${style.color}`} title={job.status}></div>
                <div>{job.detailedStatus.label}</div>
              </div>
              <details class="uno-flex uno-flex-col uno-gap-1 uno-group">
                <summary class="marker:uno-hidden uno-list-none uno-flex uno-flex-row uno-gap-2 uno-items-center uno-text-action-text hover:uno-cursor-pointer">
                  <div>details</div>
                  <div class="i-fa6-solid-arrow-right group-open:uno-rotate-90 uno-transition-transform uno-duration-300 uno-ease-out" />
                </summary>
                <div>{job.name}</div>
                <a href={`https://gitlab.com/xen-project/hardware/xen/-/jobs/${job.id.split('/').pop()}`} target="_blank" class="uno-text-blue-600 hover:uno-underline uno-text-xs">
                  View job on GitLab
                </a>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
