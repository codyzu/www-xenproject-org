import {h, render, type RefObject} from 'preact';
import {useEffect, useState, useLayoutEffect, useRef} from 'preact/hooks';
import Globe, {type GlobeMethods} from 'react-globe.gl';
import useResizeObserver from '@react-hook/resize-observer';
import clsx from 'clsx';
import earthTopology from '../assets/earth-topology.png';
import nightSky from '../assets/night-sky.png';
import earthDay from '../assets/earth-day.jpg';
import {type ParsedJob} from './HardwareGrid/schema.ts';
import {type Job} from './HardwareGrid/use-gitlab-pipeline-jobs.ts';
import {type Status, StatusPill} from './HardwareGrid/StatusPill.tsx';

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

function Marker({text, details}: Pick<MarkerData, 'text' | 'details'>) {
  return (
    <div className="uno-bg-gray uno-border-solid uno-border-1 uno-border-brand-fill uno-bg-opacity-60 uno-rounded-xl uno-p-2">
      <div className="uno-w-10 uno-h-10 i-mdi-cpu-64-bit" />
      <div className="uno-text-xs uno-font-semibold">{text}</div>
      <div className="uno-text-xs uno-font-mono">{details}</div>
    </div>
  );
}

// Type Location = {
//   readonly lat: number;
//   readonly lng: number;
//   readonly name: string;
//   readonly icons: string[];
// };

// const sanJose: Location = {lat: 37.3382, lng: -121.8863, name: 'San Jose', icons: ['i-mdi-cpu-64-bit']};
// // Const grenoble: Location = {lat: 45.1885, lng: 5.7245, name: 'Grenoble', icons: ['i-mdi-cpu-64-bit']};
// const boston: Location = {lat: 42.3601, lng: -71.0589, name: 'Boston', icons: ['i-mdi-cpu-64-bit']};
// // Const amsterdam: Location = {lat: 52.3676, lng: 4.9041, name: 'Amsterdam', icons: ['i-mdi-cpu-64-bit']};
// const berlin: Location = {lat: 52.52, lng: 13.405, name: 'Berlin', icons: ['i-mdi-cpu-64-bit']};

// const cities: Location[] = [sanJose, boston, berlin];

// const combinations = cities.flatMap((start, startIndex) =>
//   cities.filter((end, endIndex) => start !== end && endIndex > startIndex).map((end) => ({start, end})),
// );
// const arcsData = combinations.map(({start, end}) => ({
//   startLat: start.lat,
//   startLng: start.lng,
//   endLat: end.lat,
//   endLng: end.lng,
//   // Color: 'red',
// }));

// Const N = 30;
// const gData: MarkerData[] = [
//   {
//     ...sanJose,
//     text: 'San Jose',
//     details: `Xen Project number San Jose`,
//   },
//   {
//     ...grenoble,
//     text: 'Grenoble',
//     details: `Xen Project number Grenoble`,
//   },
//   {
//     ...boston,
//     text: 'Boston',
//     details: `Xen Project number Boston`,
//   },
//   {
//     ...amsterdam,
//     text: 'Amsterdam',
//     details: `Xen Project number Amsterdam`,
//   },
// ];

const northPole = {lat: 90, lng: 0};

type JobLocation = {name: string; lat: number; lng: number; icons: string[]};

export default function TestGlobe({jobs}: {readonly jobs: Map<string, Job[]>}) {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeContainerSize = useSize(globeContainerRef);
  const globeRef = useRef<GlobeMethods>();

  useEffect(() => {
    if (!globeRef.current) {
      console.warn('Globe ref is not set');
      return;
    }

    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = -1.8;
    globeRef.current.pointOfView({...northPole, altitude: 0.6});
    // Const lights = globeRef.current.lights();
    // Lights[0].intensity *= 4;
    // Lights[1].intensity = 8;
    // lights[0].intensity = 34;
    // console.log('lights', globeRef.current.lights());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeRef.current]);

  useEffect(() => {
    if (!globeRef.current) {
      console.warn('Globe ref is not set');
      return;
    }

    if (jobs.size === 0) {
      console.warn('No jobs found');
      return;
    }

    // Let cancel = false;

    // async function rotateCities() {
    //   while (true) {
    //     for (const city of cities) {
    //       if (cancel) {
    //         return;
    //       }

    //       // eslint-disable-next-line no-await-in-loop
    //       await new Promise((resolve) => {
    //         // GlobeRef.current?.pointOfView?({...city, altitude: 1.8}, 2000);
    //         globeRef.current?.pointOfView({...city, altitude: 1.8}, 2000);
    //         setTimeout(() => {
    //           resolve(true);
    //         }, 2000);
    //       });
    //     }
    //   }
    // }

    // void rotateCities();

    // Return () => {
    //   cancel = true;
    // };

    // Const c = globeRef.current.controls();

    // globeRef.current.controls().addEventListener('end', () => {
    //   console.log('Animation ended');
    // });

    // Auto-rotate
    // globeRef.current.controls().autoRotate = true;
    // globeRef.current.controls().autoRotateSpeed = 0.8;
    // globeRef.current.pointOfView({...northPole, altitude: 1});
    const firstLocation = [...jobs.values()][0][0];
    globeRef.current.pointOfView({lat: firstLocation.lat, lng: firstLocation.lng, altitude: 1.8}, 3000);
    // GlobeRef.current.controls().
  }, [jobs]);

  // Console.log('Jobs', jobs);
  // const locations: JobLocation[] = [];

  // for (const jobGroup of jobs.values()) {
  //   const job = jobGroup[0];

  //   if (job.parsed.location === undefined) {
  //     continue;
  //   }

  //   if (locations.some((l) => l.name === job.parsed.location?.name)) {
  //     continue;
  //   }

  //   locations.push({
  //     name: job.parsed.location.name,
  //     lat: job.parsed.location.lat,
  //     lng: job.parsed.location.lng,
  //     icons: job.parsed.icons,
  //   });
  // }

  // console.log('Locations', locations);

  type LocationData = {
    location: string;
    lat: number;
    lng: number;
    icons: string[];
    status: Status;
    count: number;
  };

  const locations: LocationData[] = [];
  for (const [location, locationJobs] of jobs.entries()) {
    const icons = [...new Set(locationJobs.flatMap((j) => j.icons))];

    if (icons.includes('i-mdi-cpu-64-bit')) {
      icons.splice(icons.indexOf('i-mdi-cpu-64-bit'), 1);
      icons.push('i-mdi-cpu-64-bit');
    }

    const status: Status = locationJobs.every((j) => j.raw.status === 'SUCCESS')
      ? 'SUCCESS'
      : locationJobs.some((j) => j.raw.status === 'FAILED')
        ? 'FAILED'
        : 'PENDING';

    // Console.log('locationJobs', locationJobs);
    const locationData: LocationData = {
      location,
      lat: locationJobs[0].lat,
      lng: locationJobs[0].lng,
      icons,
      status,
      count: 0,
    };
    locations.push(locationData);
  }

  const [arcData, setArcData] = useState<
    Array<{
      startLat: number;
      startLng: number;
      endLat: number;
      endLng: number;
    }>
  >([]);

  useEffect(() => {
    console.log('Jobs', jobs);
    const endPoints: Array<{lat: number; lng: number}> = [...jobs.values()].map((jobGroup) => ({
      lat: jobGroup[0].lat,
      lng: jobGroup[0].lng,
    }));

    console.log('End points', endPoints);

    const combinations = endPoints.flatMap((start, startIndex) =>
      endPoints.filter((end, endIndex) => start !== end && endIndex > startIndex).map((end) => ({start, end})),
    );

    console.log('Combinations', combinations);

    const nextArcData = combinations.map(({start, end}) => ({
      startLat: start.lat,
      startLng: start.lng,
      endLat: end.lat,
      endLng: end.lng,
    }));

    setArcData(nextArcData);

    // Const handle = setInterval(() => {
    //   setArcData((currentArcData) =>
    //     currentArcData.map((arc) => ({
    //       startLat: arc.endLat,
    //       startLng: arc.endLng,
    //       endLat: arc.startLat,
    //       endLng: arc.startLng,
    //     })),
    //   );
    // }, 4000);

    // return () => {
    //   clearInterval(handle);
    // };
  }, [jobs]);

  // Const locations = [...jobs.entries()].map(([jobName, jobGroup]) => {;

  const [filterEnabled, setFilterEnabled] = useState(false);
  useEffect(() => {
    let handle: NodeJS.Timeout;
    function toggleFilter() {
      setFilterEnabled((previous) => !previous);
      handle = setTimeout(
        () => {
          toggleFilter();
        },
        Math.random() * 3500 + 500,
      );
    }

    toggleFilter();

    return () => {
      clearTimeout(handle);
    };
  }, []);

  return (
    <div className="uno-w-full uno-h-120 uno-flex uno-self-center uno-relative uno-animate-jello uno-animate-duration-600 uno-overflow-clip">
      <div className="uno-relative uno-w-full uno-h-full uno-p-[1px] uno-flex uno-animate-fade-in">
        <div
          ref={globeContainerRef}
          className="uno-relative uno-w-full uno-h-full uno-flex uno-rounded-3xl uno-overflow-hidden"
        >
          <Globe
            ref={globeRef}
            animateIn={false}
            globeImageUrl={earthDay}
            bumpImageUrl={earthTopology}
            backgroundImageUrl={nightSky}
            // GlobeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg"
            // GlobeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
            // GlobeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
            // bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
            // backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
            width={globeContainerSize?.width ?? 0}
            height={globeContainerSize?.height ?? 0}
            // HtmlElementsData={gData}
            // htmlElement={(d) => {
            //   const data = d as MarkerData;
            //   const element = document.createElement('div');
            //   render(<Marker {...data} />, element);
            //   return element;
            // }}
            htmlElementsData={locations}
            htmlElement={(data) => {
              const location = data as LocationData;
              const element = document.createElement('div');
              // Console.log('Location', location);
              render(
                <div className="uno-card uno-shadow-gray-500 uno-bg-opacity-80 uno-flex uno-flex-col uno-items-center uno-gap-1">
                  {/* <div className="uno-flex uno-flex-row uno-gap-1 uno-items-center"> */}
                  <div className="uno-text-sm uno-font-semibold">{location.location}</div>
                  <StatusPill status={location.status} label={location.status.toLowerCase()} />
                  {/* <div className="uno-h-2 uno-w-2 uno-rounded-full uno-bg-green-600 uno-animate-pulse" /> */}
                  {/* </div> */}
                  <div className="uno-flex uno-flex-row uno-gap-1 uno-text-secondary">
                    {location.icons.map((icon) => (
                      <div
                        key={icon}
                        className={clsx(
                          'uno-rounded uno-border-1 uno-border-solid uno-border-black uno-flex uno-shadow-xl uno-shadow-gray-400 uno-p-1',
                        )}
                      >
                        <div className={clsx(icon, 'uno-w-8 uno-h-8')} />
                      </div>
                    ))}
                  </div>
                </div>,
                element,
              );
              return element;
            }}
            arcsData={arcData}
            arcStroke={2}
            arcAltitudeAutoScale={0.25}
            arcColor={['#f87171', '#fbbf24', '#4ade80', '#fbbf24', '#f87171']}
            arcDashGap={0.01}
            arcDashLength={0.05}
            arcDashAnimateTime={2000}
            arcsTransitionDuration={500}
            backgroundColor="#000000"
            // BackgroundColor="#ededed"
            // LabelsData={cities}
            // labelText={(l) => {
            //   return (l as Location).name;
            // }}
            // labelSize={2}
            // labelDotRadius={6}
            // labelColor={() => 'rgba(255, 255, 255, 0.8)'}
            // LabelLabel={(l) => {
            //   const location = l as Location;
            //   return <div>{location.name}</div>;
            //   // Return location.icons.map((icon) => (
            //   //   <div key={icon} className={clsx(icon, 'uno-text-2xl uno-flex-shrink-0')} />
            //   // ));
            // }}
            // OnAnimationEnd={() => {
            //   console.log('Animation ended');
            // }}
            // onZoom={(x) => {
            //   console.log('Zoom', x);
            // }}
          />
          <div
            className={clsx(
              'uno-top--100% uno-left--100% uno-w-300% uno-h-300% uno-animate-grain uno-bg-[url(/img/noise-1600px.webp)] uno-content-empty uno-opacity-20 uno-pointer-events-none uno-bg-cover',
              filterEnabled ? 'uno-absolute' : 'uno-hidden',
            )}
          />
          <div
            className={clsx(
              'uno-absolute uno-z-10 uno-top-10 uno-left-10 uno-pointer-events-none i-mdi-wifi-alert uno-w-10 uno-h-10 uno-text-amber-500 uno-animate-duration-400 uno-animate-fill-forwards',
              filterEnabled ? 'uno-animate-fade-in' : 'uno-animate-fade-out',
            )}
          />
        </div>
      </div>
      <div className="uno-absolute uno-z-10 uno-top-0 uno-left-0 uno-w-full uno-h-full uno-shadow-fade-in uno-shadow-surface-secondary uno-pointer-events-none uno-rounded-3xl" />
    </div>
  );
}
