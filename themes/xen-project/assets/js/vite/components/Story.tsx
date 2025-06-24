import {type IParallax, Parallax, ParallaxLayer} from '@react-spring/parallax';
import clsx from 'clsx';
import {useEffect, useRef, useState} from 'preact/hooks';
import {type ComponentChildren} from 'preact';
import panda from '../assets/panda-space-suite.png';
import dataCenter from '../assets/data-center.png';
import car from '../assets/car.png';
import industrial from '../assets/industrial.png';

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

export function Story() {
  const storyRef = useRef<IParallax>(null);

  const [page, setPage] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const nextStars: Star[] = Array.from({length: 2000}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: Math.random() * 3 + 1, // Width between 1 and 3
      height: Math.random() * 3 + 1, // Height between 1 and 3
      duration: (Math.round(Math.random() * 10) + 6) * 200, // Duration between 1 and 3 seconds
      shadowColor: shadowColors[Math.floor(Math.random() * shadowColors.length)],
      shadowSize: shadowSizes[Math.floor(Math.random() * shadowSizes.length)],
    }));

    setStars(nextStars);
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

  const pages = 12;
  const endIndex = pages - 1;
  return (
    <div className="uno-relative uno-w-full uno-h-[calc(100dvh-108px)]-bak uno-h-100dvh uno-overflow-hidden uno-m-t--80px uno-bg-black">
      <Parallax ref={storyRef} className="uno-top-0_bak uno-left-0_bak uno-h-full uno-w-full" pages={pages}>
        {/* Background layers */}
        <ParallaxLayer speed={1.3} offset={0} factor={12 * 2.2} className="uno-flex uno-relative uno-w-full">
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
        <ParallaxLayer speed={1.8} offset={0} factor={12 * 2.65} className="uno-flex uno-relative uno-w-full">
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

        {/* Content layers */}
        <ParallaxLayer
          offset={0}
          className="uno-flex uno-flex-col uno-items-center uno-justify-center uno-p-20"
          speed={1.3}
        >
          <div
            className={clsx(
              'uno-flex uno-flex-col uno-text-white uno-text-4xl uno-gap-2 uno-animate-fade-in',
              page === 0 ? 'uno-opacity-100' : 'uno-opacity-0',
              'uno-transition-opacity',
              'uno-duration-300',
              'uno-ease-in-out',
            )}
          >
            <div className="">
              Meet <strong className="uno-xen-shadow">Xen</strong>.
            </div>
            <div>The world&apos;s most secure, stable, and performant open source hypervisor.</div>
            <div className="uno-m-t-10 uno-text-2xl">Scroll down to meet you guide...</div>
          </div>
        </ParallaxLayer>
        <ParallaxLayer
          sticky={{start: 0, end: endIndex - 1}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-end uno-text-white"
        >
          <div className="uno-w-20 uno-h-20  i-memory-arrow-down uno-animate-bounce uno-m-b-10" />
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          sticky={{start: 1, end: endIndex - 1}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-center uno-p-t-50"
        >
          <img
            className="uno-w-20% uno-max-w-100 sm:uno-w-100-bak sm:uno-max-w-50%-bak uno-animate-bounce uno-animate-duration-2300"
            src={panda}
          />
        </ParallaxLayer>
        <ParallaxLayer
          sticky={{start: 0.8, end: 2}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-between uno-p-t-50 uno-p-x-20 uno-text-white uno-text-4xl uno-font-semibold-bak"
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
            ...the <strong className="uno-xen-shadow">Xen</strong> Panda travels through the universe, guiding users
            through the wonders of <strong className="uno-xen-shadow">Xen</strong> virtualization.
          </div>
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: 2, end: 3}} className="uno-flex uno-h-full">
          <PlanetForeground name="Planet Data Center" image={dataCenter} isTextVisible={page >= 2 && page <= 3.2}>
            Xen brings the power of virtualization to data centers around the world, enabling efficient resource
            utilization and scalability. With Xen, data centers can run multiple virtual machines on a single physical
            server, reducing hardware costs and energy consumption.
          </PlanetForeground>
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: 5, end: 6}} className="uno-flex uno-h-full">
          <PlanetForeground name="Planet Automotive" image={car} isTextVisible={page >= 5 && page <= 6.2}>
            Xen powers the future of automotive technology by enabling secure and efficient virtualization in vehicles.
            With Xen, automotive systems can isolate critical functions, enhance safety, and support advanced features
            like autonomous driving and in-car entertainment.
          </PlanetForeground>
        </ParallaxLayer>
        <ParallaxLayer sticky={{start: 8, end: 9}} className="uno-flex uno-h-full">
          <PlanetForeground name="Planet Industrial" image={industrial} isTextVisible={page >= 8 && page <= 9.2}>
            Xen revolutionizes industrial automation by providing a secure and efficient virtualization platform for
            industrial systems. With Xen, manufacturers can optimize resource utilization, enhance system reliability,
            and support advanced features like predictive maintenance and real-time monitoring.
          </PlanetForeground>
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
  return (
    <div
      className={clsx(
        'uno-grid uno-grid-cols-1 uno-grid-rows-2 sm:uno-grid-cols-2 sm:uno-grid-rows-1',
        'uno-p-20',
        'uno-text-white',
        isTextVisible ? 'uno-opacity-100' : 'uno-opacity-0',
        'uno-transition-opacity',
        'uno-duration-400',
        'uno-ease-in-out',
      )}
    >
      <div className={clsx('uno-flex uno-flex-col uno-gap-2')}>
        <div className="uno-text-4xl uno-font-semibold">{name}</div>
        <div className="text-2xl">{children}</div>
      </div>
      <div className="uno-flex uno-flex-row uno-items-end uno-justify-end">
        <img className="uno-object-contain" src={image} />
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
