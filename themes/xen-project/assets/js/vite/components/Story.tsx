import {type IParallax, Parallax, ParallaxLayer} from '@react-spring/parallax';
import clsx from 'clsx';
import {useEffect, useRef, useState} from 'preact/hooks';
import panda from '../assets/panda-space-suite.png';

export function Story() {
  const storyRef = useRef<IParallax>(null);

  const [page, setPage] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (storyRef.current) {
        const nextPage = Math.round((storyRef.current.current * 10) / storyRef.current.space) / 10;

        if (nextPage !== page) {
          console.log('p', page, 'next', nextPage);
          // SetScrollDown(nextPage > page);
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

  // UseEffect(() => {
  //   console.log('current', storyRef.current?.current, 'offset', storyRef.current?.offset);
  // }, [storyRef.current?.current, storyRef.current?.offset]);

  console.log(storyRef.current);
  return (
    <div className="uno-relative uno-w-full uno-h-screen uno-overflow-hidden">
      <Parallax
        ref={storyRef}
        className="uno-top-0 uno-left-0 uno-h-full uno-w-full"
        pages={6}
        // Style={{height: '100%', width: '100%'}}
      >
        {/* Background layers */}
        <ParallaxLayer offset={0} factor={2} speed={0} className="uno-bg-black" />
        <ParallaxLayer
          offset={2}
          speed={0}
          className={clsx(
            // 'uno-bg-gradient-from-blue-500 uno-bg-gradient-via-gray-400 uno-bg-gradient-to-red',
            // 'uno-bg-gradient-from-op-100-10',
            'uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(44,168,96,1)_55%,rgba(46,46,46,1)_60%,rgba(100,100,100,1)_110%]',
            'uno-bg-gradient-shape-[circle_at_50%_220%]',
            'uno-bg-gradient-radial',
          )}
        />
        <ParallaxLayer
          offset={3}
          speed={0}
          className={clsx(
            // 'uno-bg-gradient-from-blue-500 uno-bg-gradient-via-gray-400 uno-bg-gradient-to-red',
            // 'uno-bg-gradient-from-op-100-10',
            'uno-bg-gradient-stops-[rgba(42,123,155,1)_0%,rgba(168,44,44,1)_55%,rgba(46,46,46,1)_60%,rgba(100,100,100,1)_110%]',
            'uno-bg-gradient-shape-[circle_at_50%_220%]',
            'uno-bg-gradient-radial',
          )}
        />
        <ParallaxLayer offset={4} factor={2} speed={0} className="uno-bg-black" />

        {/* Content layers */}
        <ParallaxLayer
          sticky={{start: 0.8, end: 2}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-start uno-p-t-20 uno-text-white uno-text-3xl uno-font-semibold"
        >
          <div
            className={clsx(
              page >= 0.8 && page <= 2 ? 'uno-opacity-100' : 'uno-opacity-0',
              'uno-transition-opacity',
              'uno-duration-300',
              'uno-ease-in-out',
            )}
          >
            Meet the Xen Panda
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          // Horizontal
          offset={1}
          sticky={{start: 2, end: 3}}
          // Speed={-1}
          className="uno-flex uno-flex-col uno-items-end uno-justify-start"
        >
          <div
            className={clsx(
              'uno-text-white uno-w-30% uno-bg-pink-bak uno-h-50% uno-p-t-10 uno-flex uno-flex-col',
              page > 1.8 && page < 3.2 ? 'uno-opacity-100' : 'uno-opacity-0',
              'uno-transition-opacity',
              'uno-duration-300',
              'uno-ease-in-out',
            )}
          >
            <div className="uno-text-3xl uno-font-semibold">Data Centers</div>{' '}
            <div>
              Xen brings the power of virtualization to data centers around the world, enabling efficient resource
              utilization and scalability. With Xen, data centers can run multiple virtual machines on a single physical
              server, reducing hardware costs and energy consumption.
            </div>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          sticky={{start: 1, end: 4}}
          className="uno-flex uno-flex-col uno-items-center uno-justify-center"
        >
          <img className="uno-w-100 uno-max-w-50% uno-animate-bounce uno-animate-duration-2300" src={panda} />
        </ParallaxLayer>
        {/* <ParallaxLayer offset={2} speed={1} style={{backgroundColor: '#87BCDE'}} /> */}
        {/* <ParallaxLayer offset={0} speed={2.5}>
          <p>Parallax</p>
        </ParallaxLayer> */}
      </Parallax>
    </div>
  );
}
