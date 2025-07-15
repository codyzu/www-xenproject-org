import {type IParallax, Parallax, ParallaxLayer} from '@react-spring/parallax';
import clsx from 'clsx';
import {useEffect, useRef, useState} from 'react';
import panda from '../assets/panda-space-suite.webp';
import dataCenter from '../assets/data-center.webp';
import consumer from '../assets/consumer.webp';
import car from '../assets/car.webp';
import industrial from '../assets/industrial.webp';

type Star = {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
  shadowColor: string;
  shadowSize: string;
};

const shadowColors = [
  'uno-shadow-pink',
  'uno-shadow-amber',
  'uno-shadow-green',
  'uno-shadow-white',
  'uno-shadow-white',
];
const shadowSizes = ['uno-shadow-glow', 'uno-shadow-glow-lg', 'uno-shadow-glow-xl'];

export default function Story() {
  const storyRef = useRef<IParallax>(null);

  const [page, setPage] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const nextStars: Star[] = Array.from({length: 2000}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: Math.random() * 3 + 1, // Width between 1 and 3
      height: Math.random() * 3 + 1, // Height between 1 and 3
      // Duration between 600 and 2600ms in steps of 200ms
      // Note, this should match the safelist in uno.config.ts
      duration: (Math.round(Math.random() * 10) + 6) * 200,
      shadowColor: shadowColors[Math.floor(Math.random() * shadowColors.length)],
      shadowSize: shadowSizes[Math.floor(Math.random() * shadowSizes.length)],
    }));

    setStars(nextStars);
  }, []);

  useEffect(() => {
    function handleIosStatusBarTap() {
      // On iOS Safari, tapping the status bar scrolls the window to top
      if (window.scrollY === 0 && storyRef.current) {
        storyRef.current.scrollTo(0); // Scroll to the first page
      }
    }

    window.addEventListener('scroll', handleIosStatusBarTap);

    return () => {
      window.removeEventListener('scroll', handleIosStatusBarTap);
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (storyRef.current) {
        const nextPage = Math.round((storyRef.current.current * 10) / storyRef.current.space) / 10;

        if (nextPage !== page) {
          console.log('p', page, 'next', nextPage);
        }

        setPage(nextPage);
      }
    }

    const current = storyRef.current?.container?.current as HTMLDivElement | undefined;

    current?.addEventListener('scroll', handleScroll);

    return () => {
      current?.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

  const pages = 16;
  const endIndex = pages - 1;
  return (
    <div className="uno-relative uno-w-full uno-h-100dvh uno-overflow-hidden uno-bg-black">
      <Parallax ref={storyRef} className="uno-top-0_bak uno-left-0_bak uno-h-full uno-w-full" pages={pages}>
        {/* Background layers */}
        <ParallaxLayer speed={1.3} offset={0} factor={12 * 2.9} className="uno-flex uno-relative uno-w-full">
          <div className="uno-flex uno-relative uno-w-full">
            {stars.slice(0, 999).map((star, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={clsx(
                  `uno-bg-white uno-rounded-full uno-animate-pulse uno-animate-duration-${star.duration} uno-absolute`,
                  star.shadowColor,
                  star.shadowSize,
                )}
                style={{
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  width: `${star.width}px`,
                  height: `${star.height}px`,
                }}
              />
            ))}
          </div>
        </ParallaxLayer>
        <ParallaxLayer speed={1.8} offset={0} factor={12 * 3.5} className="uno-flex uno-relative uno-w-full">
          <div className="uno-flex uno-relative uno-w-full">
            {stars.slice(1000, 1999).map((star, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={clsx(
                  `uno-bg-white uno-rounded-full uno-animate-pulse uno-animate-duration-${star.duration} uno-absolute`,
                  star.shadowColor,
                  star.shadowSize,
                )}
                style={{
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  width: `${star.width}px`,
                  height: `${star.height}px`,
                }}
              />
            ))}
          </div>
        </ParallaxLayer>
        <PlanetBackground
          start={2}
          gradient="uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(44,168,96,1)_35%,rgba(100,100,100,0.3)_40%,rgba(0,0,0,0)_45%]"
        />
        <PlanetBackground
          start={5}
          gradient="uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(168,44,44,1)_35%,rgba(100,100,100,0.3)_40%,rgba(0,0,0,0)_45%]"
        />
        <PlanetBackground
          start={8}
          gradient="uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgb(204,175,47)_35%,rgba(100,100,100,0.3)_40%,rgba(0,0,0,0)_45%]"
        />
        <PlanetBackground
          start={11}
          gradient="uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(114,63,204,1)_35%,rgba(100,100,100,0.3)_40%,rgba(0,0,0,0)_45%]"
        />

        {/* Content layers */}
        <ParallaxLayer
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
        </ParallaxLayer>
        <ParallaxLayer
          sticky={{start: 0, end: endIndex - 1}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-end uno-text-white"
        >
          <div className="uno-w-10 uno-h-10 sm:(uno-w-16 uno-h-16)  i-fa6-solid-arrow-down uno-animate-bounce uno-m-b-10" />
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          sticky={{start: 1, end: endIndex - 2}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-center uno-p-t-50"
        >
          <img className="uno-w-20% uno-max-w-100 uno-animate-bounce uno-animate-duration-2300" src={panda} />
        </ParallaxLayer>
        <ParallaxLayer
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
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: 2, end: 3}} className="uno-flex uno-h-full-bak">
          <PlanetForeground name="Planet Data Center" image={dataCenter} isTextVisible={page >= 2 && page <= 3.2}>
            <Xen /> brings virtualization to a wide range of server environments, from data centers to enterprise IT,
            edge deployments, and labs. As an Open Source hypervisor, <Xen /> powers a variety of platforms supported by
            both community and commercial contributors. Sub-projects like <strong>XCP-ng</strong> offer a drop-in
            solution built on <Xen /> for those seeking a fully open and stable virtualization stack. Commercial
            offerings from <Xen /> partners provide additional features, support, and long-term stability, all built on
            the same trusted core. Whether you&apos;re managing thousands of virtual machines or a single node
            on-premises, <Xen /> provides the flexibility and stability to meet your needs.
          </PlanetForeground>
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: 5, end: 6}} className="uno-flex uno-h-full">
          <PlanetForeground name="Planet Automotive" image={car} isTextVisible={page >= 5 && page <= 6.2}>
            <Xen /> is powering innovation in automotive computing by enabling secure, efficient virtualization across
            in-vehicle systems. From dashboards and infotainment to safety-critical functions, <Xen /> consolidates
            multiple operating systems onto a single SoC while preserving isolation and performance. It plays a key role
            in the Automotive Grade Linux (AGL) Software-Defined Vehicle reference platform, supporting
            mixed-criticality workloads with VirtIO and real-time OSes like Zephyr. With long-term security support and
            a rigorous open CI system, <Xen /> provides a trusted foundation for next-generation vehicles. Automotive
            partners across manufacturing and component sectors collaborate within the <Xen /> ecosystem to advance
            software-defined mobility.
          </PlanetForeground>
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: 8, end: 9}} className="uno-flex uno-h-full">
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
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: 11, end: 12}} className="uno-flex uno-h-full">
          <PlanetForeground name="Planet Consumer" image={consumer} isTextVisible={page >= 11 && page <= 12.2}>
            <Xen /> isn&apos;t just for servers and vehicles, it&apos;s empowering end-user systems too. Renowned
            security-focused projects like Qubes OS and OpenXT rely on <Xen /> to provide hardware-enforced isolation on
            desktops and laptops, ensuring privacy and protection for advanced users and developers. Contributors from
            these communities even provide test hardware to the <Xen /> CI network, reinforcing the platform&apos;s
            real-world reliability. <Xen /> also powers home labs, small businesses, and university research
            environments, offering a secure, flexible virtualization stack for experimentation and innovation.
          </PlanetForeground>
        </ParallaxLayer>
        <ParallaxLayer
          sticky={{start: endIndex - 1.5, end: endIndex}}
          // Offset={endIndex - 1.5}
          className={clsx(
            'uno-flex uno-flex-col uno-items-center uno-justify-center uno-gap-4 uno-p-8 sm:uno-p-20',
            'uno-animate-fade-in',
            page >= endIndex - 1.5 && page <= endIndex - 0.8 ? 'uno-opacity-100' : 'uno-opacity-0',
            'uno-transition-opacity uno-duration-300  uno-ease-in-out',
            'uno-text-white uno-text-2xl sm:uno-text-4xl uno-text-center',
          )}
          // Speed={1.3}
        >
          <div className="">
            Where will <Xen /> take you?
          </div>
          <div className="uno-relative uno-w-full uno-h-90 sm:uno-h-130 uno-flex uno-items-center uno-justify-center">
            {/* Glowing Xen Logo */}
            <div className="uno-absolute uno-z-10 uno-text-white uno-font-bold uno-text-4xl sm:uno-text-6xl uno-xen-shadow">
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
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: 0, end: 0}}>
          <Header />
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: endIndex, end: endIndex}} className="uno-bg-surface-secondary">
          <div className="uno-bg-surface-secondary">
            <Article />
            <Footer />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={endIndex - 1} className="uno-h-full uno-flex uno-flex-col uno-justify-end">
          <div className="uno-bg-pink-bak uno-h-20 uno-bg-gradient-from-surface-secondary uno-bg-gradient-to-black uno-bg-gradient-to-t uno-bg-gradient-to-opacity-50" />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

function Xen() {
  return <span className="uno-xen-shadow uno-font-bold uno-font-italic">Xen</span>;
}

function PlanetForeground({
  name,
  image,
  children,
  isTextVisible,
}: {
  readonly name: string;
  readonly image: string;
  readonly children: ComponentChildren;
  readonly isTextVisible: boolean;
}) {
  // Ideally this would return the ParallaxLayer, but sticky layers don't work if they are wrapped in a Fragment or Component (unlike non sticky layers)
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

function PlanetBackground({start, gradient}: {readonly start: number; readonly gradient: string}) {
  return (
    <ParallaxLayer
      offset={start}
      speed={0}
      factor={3}
      className={clsx('uno-relative', gradient, 'uno-bg-gradient-shape-[circle_at_50%_50%]', 'uno-bg-gradient-radial')}
    />
  );
}

function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const footer = footerRef.current;
    const existingFooter = document.querySelector('footer');
    console.log('footerRef', footer, 'existingFooter', existingFooter);
    if (footer && existingFooter) {
      console.log('moving footer', footer, 'existing', existingFooter);
      footer.append(existingFooter);
    }
  }, []);

  return <div ref={footerRef} />;
}

function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const header = headerRef.current;
    const existingHeader = document.querySelector('header');
    console.log('headerRef', header, 'existingHeader', existingHeader);
    if (header && existingHeader) {
      console.log('moving header', header, 'existing', existingHeader);
      header.append(existingHeader);
    }
  }, []);

  return <div ref={headerRef} />;
}

function Article() {
  const articleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const article = articleRef.current;
    const existingArticle = document.querySelector('article');
    console.log('headerRef', article, 'existingHeader', existingArticle);
    if (article && existingArticle) {
      console.log('moving header', article, 'existing', existingArticle);
      article.append(existingArticle);
    }
  }, []);

  return <div ref={articleRef} className="uno-bg-surface-secondary" />;
}
