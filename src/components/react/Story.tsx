import clsx from 'clsx';
import {type CSSProperties, type ReactNode, useEffect, useRef, useState} from 'react';
import panda from '../../assets/story/panda-space-suite.webp?url';
import dataCenter from '../../assets/story/data-center.webp?url';
import consumer from '../../assets/story/consumer.webp?url';
import car from '../../assets/story/car.webp?url';
import industrial from '../../assets/story/industrial.webp?url';

const pages = 16;
const endIndex = pages - 1;

export default function Story() {
  const storyRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updatePage = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const story = storyRef.current;
        if (!story) return;
        const nextPage = Math.max(0, Math.min(endIndex, -story.getBoundingClientRect().top / window.innerHeight));
        setPage(Math.round(nextPage * 10) / 10);
      });
    };

    updatePage();
    window.addEventListener('scroll', updatePage, {passive: true});
    window.addEventListener('resize', updatePage);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updatePage);
      window.removeEventListener('resize', updatePage);
    };
  }, []);

  const planets = [
    {start: 2, end: 3},
    {start: 5, end: 6},
    {start: 8, end: 9},
    {start: 11, end: 12},
  ];

  return (
    <div
      ref={storyRef}
      data-story-root
      className="uno-relative uno-w-full uno-bg-black"
      style={{height: `${pages * 100}dvh`}}
    >
      <div
        data-story-viewport
        className="uno-sticky uno-top-0 uno-h-100dvh uno-w-full uno-overflow-hidden uno-bg-black"
      >
        {/* Repeating painted backgrounds avoid thousands of animated DOM nodes. */}
        <StarField page={page} depth="far" />
        <StarField page={page} depth="near" />
        <PlanetBackground
          page={page}
          start={2}
          gradient="uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(44,168,96,1)_35%,rgba(100,100,100,0.3)_40%,rgba(0,0,0,0)_45%]"
        />
        <PlanetBackground
          page={page}
          start={5}
          gradient="uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(168,44,44,1)_35%,rgba(100,100,100,0.3)_40%,rgba(0,0,0,0)_45%]"
        />
        <PlanetBackground
          page={page}
          start={8}
          gradient="uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgb(204,175,47)_35%,rgba(100,100,100,0.3)_40%,rgba(0,0,0,0)_45%]"
        />
        <PlanetBackground
          page={page}
          start={11}
          gradient="uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(114,63,204,1)_35%,rgba(100,100,100,0.3)_40%,rgba(0,0,0,0)_45%]"
        />

        {/* Content layers */}
        <StoryLayer
          page={page}
          offset={0}
          className={clsx(
            'uno-flex uno-flex-col uno-items-center uno-justify-center uno-gap-4 uno-p-8 sm:uno-p-20',
            'uno-animate-fade-in',
            page === 0 ? 'uno-opacity-100' : 'uno-opacity-0',
            'uno-transition-opacity uno-duration-300  uno-ease-in-out',
            'uno-text-white uno-text-2xl sm:uno-text-4xl uno-text-center',
          )}
          speed={1.3}
        >
          <div className="">
            Meet <Xen />.
          </div>
          <div>The world&apos;s most secure, stable, and performant open source hypervisor.</div>
          <div className="uno-m-t-10 uno-text-base sm:uno-text-2xl">Scroll down to meet your guide...</div>
        </StoryLayer>
        <StoryLayer
          page={page}
          sticky={{start: 0, end: endIndex - 1}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-end uno-text-white"
        >
          <div className="uno-w-10 uno-h-10 sm:(uno-w-16 uno-h-16)  i-fa6-solid-arrow-down uno-animate-bounce uno-m-b-10" />
        </StoryLayer>
        <StoryLayer
          page={page}
          sticky={{start: 1, end: endIndex - 2}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-center uno-p-t-50"
        >
          <img
            data-story-guide
            className={clsx(
              'uno-w-20% uno-max-w-100 uno-animate-duration-3200 uno-animate-bounce',
              // Pause animations when on a planet
              planets.some((planet) => page >= planet.start && page <= planet.end) && 'uno-animate-paused',
            )}
            src={panda}
          />
        </StoryLayer>
        <StoryLayer
          page={page}
          sticky={{start: 0.8, end: 2}}
          className={clsx(
            'uno-flex uno-flex-col uno-items-center uno-justify-start uno-p-t-20 sm:uno-p-t-50 uno-p-x-4 sm:uno-p-x-20',
            'uno-text-white uno-text-2xl sm:uno-text-4xl',
          )}
        >
          <div
            className={clsx(
              page >= 0.6 && page <= 1.6 ? 'uno-opacity-100' : 'uno-opacity-0',
              'uno-transition-opacity',
              'uno-duration-300',
              'uno-ease-in-out',
              'uno-text-center',
            )}
          >
            ...the <Xen /> Panda travels through the universe, guiding users through the wonders of <Xen />{' '}
            virtualization.
          </div>
        </StoryLayer>
        <StoryLayer page={page} sticky={planets[0]} className="uno-flex" dataScene="data-center">
          <PlanetForeground name="Planet Data Center" image={dataCenter} isTextVisible={page >= 2 && page <= 3.2}>
            <Xen /> brings virtualization to a wide range of server environments, from data centers to enterprise IT,
            edge deployments, and labs. As an Open Source hypervisor, <Xen /> powers a variety of platforms supported by
            both community and commercial contributors. Sub-projects like <strong>XCP-ng</strong> offer a drop-in
            solution built on <Xen /> for those seeking a fully open and stable virtualization stack. Commercial
            offerings from <Xen /> partners provide additional features, support, and long-term stability, all built on
            the same trusted core. Whether you&apos;re managing thousands of virtual machines or a single node
            on-premises, <Xen /> provides the flexibility and stability to meet your needs.
          </PlanetForeground>
        </StoryLayer>
        <StoryLayer page={page} sticky={planets[1]} className="uno-flex uno-h-full" dataScene="automotive">
          <PlanetForeground name="Planet Automotive" image={car} isTextVisible={page >= 5 && page <= 6.2}>
            <Xen /> is powering innovation in automotive computing by enabling secure, efficient virtualization across
            in-vehicle systems. From dashboards and infotainment to safety-critical functions, <Xen /> consolidates
            multiple operating systems onto a single SoC while preserving isolation and performance. It plays a key role
            in the <strong>Automotive Grade Linux</strong> Software-Defined Vehicle reference platform, supporting
            mixed-criticality workloads with VirtIO and real-time OSes like <strong>Zephyr</strong>. With long-term
            security support and a rigorous open CI system, <Xen /> provides a trusted foundation for next-generation
            vehicles. Automotive partners across manufacturing and component sectors collaborate within the <Xen />{' '}
            ecosystem to advance software-defined mobility.
          </PlanetForeground>
        </StoryLayer>
        <StoryLayer page={page} sticky={planets[2]} className="uno-flex uno-h-full" dataScene="industrial">
          <PlanetForeground name="Planet Industrial" image={industrial} isTextVisible={page >= 8 && page <= 9.2}>
            <Xen /> is transforming industrial computing by enabling secure, efficient virtualization across embedded
            controllers, robotics, factory automation systems, and energy infrastructure. With real-time performance,
            low and deterministic interrupt latency, strong isolation, and minimal overhead, <Xen /> allows
            manufacturers and operators to consolidate workloads and extend device lifecycles. The open CI network
            ensures compatibility with real-world hardware while supporting robust validation workflows essential in
            mission-critical environments, enabling predictive maintenance strategies. Industrial and energy sector
            partners can contribute and test directly within the <Xen /> ecosystem, helping shape a resilient and
            flexible virtualization platform for modern operations.
          </PlanetForeground>
        </StoryLayer>
        <StoryLayer page={page} sticky={planets[3]} className="uno-flex uno-h-full" dataScene="consumer">
          <PlanetForeground name="Planet Consumer" image={consumer} isTextVisible={page >= 11 && page <= 12.2}>
            <Xen /> isn&apos;t just for servers and vehicles, it&apos;s empowering end-user systems too. Renowned
            security-focused projects like <strong>Qubes OS</strong> and <strong>OpenXT</strong> rely on <Xen /> to
            provide hardware-enforced isolation on desktops and laptops, ensuring privacy and protection for advanced
            users and developers. Contributors from these communities even provide test hardware to the <Xen /> CI
            network, reinforcing the platform&apos;s real-world reliability. <Xen /> also powers home labs, small
            businesses, and university research environments, offering a secure, flexible virtualization stack for
            experimentation and innovation.
          </PlanetForeground>
        </StoryLayer>
        <StoryLayer
          page={page}
          sticky={{start: endIndex - 1.5, end: endIndex}}
          dataScene="finale"
          className={clsx(
            'uno-flex uno-flex-col uno-items-center uno-justify-center uno-gap-4 uno-p-8 sm:uno-p-20',
            'uno-animate-fade-in',
            page >= endIndex - 1.5 ? 'uno-opacity-100' : 'uno-opacity-0',
            'uno-transition-opacity uno-duration-300  uno-ease-in-out',
            'uno-text-white uno-text-2xl sm:uno-text-4xl uno-text-center',
          )}
        >
          <div className="">
            Where will <Xen /> take you?
          </div>
          <div className="uno-relative uno-w-full uno-h-90 sm:uno-h-130 uno-flex uno-items-center uno-justify-center">
            {/* Glowing Xen Logo */}
            <div className="uno-absolute uno-z-10 uno-text-white uno-font-bold uno-text-4xl sm:uno-text-6xl">
              <Xen />
            </div>

            {/* Orbiting rings */}
            <div className="uno-absolute uno-animate-spin uno-animate-duration-14000 uno-w-40 uno-h-40 sm:uno-w-74 sm:uno-h-74 uno-border-2 uno-border-white uno-border-dashed uno-rounded-full uno-opacity-30" />
            <div className="uno-absolute uno-animate-spin uno-animate-duration-16000 uno-w-74 uno-h-74 sm:uno-w-120 sm:uno-h-120 uno-border-2 uno-border-white uno-border-dashed uno-rounded-full uno-opacity-20" />

            {/* Orbiting planets */}
            <div className="uno-absolute uno-w-full uno-h-full uno-flex uno-items-center uno-justify-center">
              <div className="uno-orbit-0">
                <div className="uno-w-24 uno-h-24 uno-bg-gradient-shape-[circle_at_50%_50%] uno-bg-gradient-radial uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(114,63,204,1)_40%,rgba(100,100,100,0.3)_45%,rgba(0,0,0,0)_45%]" />
              </div>
            </div>
            <div className="uno-absolute uno-w-full uno-h-full uno-flex uno-items-center uno-justify-center">
              <div className="uno-orbit-1">
                <div className="uno-w-24 uno-h-24 uno-bg-gradient-shape-[circle_at_50%_50%] uno-bg-gradient-radial uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgb(204,175,47)_40%,rgba(100,100,100,0.3)_45%,rgba(0,0,0,0)_45%]" />
              </div>
            </div>
            <div className="uno-absolute uno-w-full uno-h-full uno-flex uno-items-center uno-justify-center">
              <div className="uno-orbit-2">
                <div className="uno-w-24 uno-h-24 uno-bg-gradient-shape-[circle_at_50%_50%] uno-bg-gradient-radial uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(168,44,44,1)_40%,rgba(100,100,100,0.3)_45%,rgba(0,0,0,0)_45%]" />
              </div>
            </div>
            <div className="uno-absolute uno-w-full uno-h-full uno-flex uno-items-center uno-justify-center">
              <div className="uno-orbit-3">
                <div className="uno-w-24 uno-h-24 uno-bg-gradient-shape-[circle_at_50%_50%] uno-bg-gradient-radial uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(44,168,96,1)_40%,rgba(100,100,100,0.3)_45%,rgba(0,0,0,0)_45%]" />
              </div>
            </div>
          </div>
        </StoryLayer>
        <div
          data-story-transition
          aria-hidden="true"
          className="uno-pointer-events-none uno-absolute uno-inset-x-0 uno-bottom-0 uno-h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--color-surface-secondary))',
            opacity: Math.max(0, Math.min(1, page - (endIndex - 1))),
          }}
        />
      </div>
    </div>
  );
}

function StarField({page, depth}: {readonly page: number; readonly depth: 'far' | 'near'}) {
  const isNear = depth === 'near';
  const movement = page * (isNear ? -7 : -3);
  const style = {
    backgroundImage: isNear
      ? [
          'radial-gradient(circle, rgba(255,255,255,0.95) 0 1px, transparent 1.8px)',
          'radial-gradient(circle, rgba(244,114,182,0.8) 0 1.4px, transparent 2.6px)',
          'radial-gradient(circle, rgba(74,222,128,0.75) 0 1.2px, transparent 2.4px)',
          'radial-gradient(circle, rgba(251,191,36,0.72) 0 1.1px, transparent 2.3px)',
        ].join(',')
      : [
          'radial-gradient(circle, rgba(255,255,255,0.75) 0 0.8px, transparent 1.5px)',
          'radial-gradient(circle, rgba(147,197,253,0.55) 0 0.9px, transparent 1.7px)',
          'radial-gradient(circle, rgba(255,255,255,0.5) 0 0.7px, transparent 1.4px)',
        ].join(','),
    backgroundPosition: isNear
      ? `0 ${movement}px, 31px ${movement * 0.7}px, 67px ${movement * 1.2}px, 109px ${movement * 0.5}px`
      : `11px ${movement}px, 53px ${movement * 0.6}px, 97px ${movement * 1.3}px`,
    backgroundSize: isNear ? '61px 67px, 97px 89px, 131px 127px, 173px 149px' : '43px 47px, 79px 83px, 113px 109px',
    filter: isNear ? 'drop-shadow(0 0 4px rgba(255,255,255,0.55))' : 'drop-shadow(0 0 2px rgba(255,255,255,0.35))',
  } satisfies CSSProperties;

  return (
    <div
      data-story-star
      data-star-depth={depth}
      aria-hidden="true"
      className="uno-absolute uno-inset-[-15%]"
      style={style}
    />
  );
}

function Xen() {
  return (
    <span className="uno-font-bold uno-font-italic uno-leading-none">
      X<span className="uno-text-0.8em uno-align-xen uno-m-l-[-0.16em]">en</span>
    </span>
  );
}

function PlanetForeground({
  name,
  image,
  children,
  isTextVisible,
}: {
  readonly name: string;
  readonly image: string;
  readonly children: ReactNode;
  readonly isTextVisible: boolean;
}) {
  return (
    <div
      className={clsx(
        'uno-flex uno-flex-col uno-justify-between sm:uno-grid sm:uno-grid-cols-2 sm:uno-grid-rows-1',
        'uno-p-2 sm:uno-p-18',
        'uno-text-white',
        isTextVisible ? 'uno-opacity-100' : 'uno-opacity-0',
        'uno-transition-opacity',
        'uno-duration-400',
        'uno-ease-in-out',
        'uno-h-auto',
      )}
    >
      <div
        className={clsx(
          'uno-flex uno-flex-col uno-gap-2 uno-bg-gray-7 uno-bg-opacity-40 uno-p-2 sm:uno-p-4 uno-rounded-lg uno-self-start uno-backdrop-blur-sm',
        )}
      >
        <div className="uno-text-2xl sm:uno-text-4xl uno-font-semibold">{name}</div>
        <div className="uno-text-base sm:uno-text-2xl">{children}</div>
      </div>
      <div className="uno-flex uno-flex-row uno-items-end uno-justify-end uno-max-h-30% sm:uno-max-h-none">
        <img className="uno-object-contain uno-max-h-full sm:uno-max-w-full uno-max-w-50%" src={image} />
      </div>
    </div>
  );
}

function PlanetBackground({
  page,
  start,
  gradient,
}: {
  readonly page: number;
  readonly start: number;
  readonly gradient: string;
}) {
  return (
    <StoryLayer
      page={page}
      offset={start}
      heightPages={3}
      className={clsx(gradient, 'uno-bg-gradient-shape-[circle_at_50%_50%]', 'uno-bg-gradient-radial')}
    />
  );
}

function StoryLayer({
  page,
  offset = 0,
  speed = 1,
  heightPages = 1,
  sticky,
  className,
  dataScene,
  children,
}: {
  readonly page: number;
  readonly offset?: number;
  readonly speed?: number;
  readonly heightPages?: number;
  readonly sticky?: {readonly start: number; readonly end: number};
  readonly className?: string;
  readonly dataScene?: string;
  readonly children?: ReactNode;
}) {
  let translatePages = (offset - page) * speed;
  if (sticky) {
    translatePages = page < sticky.start ? sticky.start - page : page > sticky.end ? sticky.end - page : 0;
  }

  const style = {
    transform: `translate3d(0, ${translatePages * 100}dvh, 0)`,
    height: `${heightPages * 100}dvh`,
  } satisfies CSSProperties;

  return (
    <div
      data-story-layer
      data-story-scene={dataScene}
      className={clsx('uno-absolute uno-inset-0 uno-h-100dvh uno-w-full', className)}
      style={style}
    >
      {children}
    </div>
  );
}
