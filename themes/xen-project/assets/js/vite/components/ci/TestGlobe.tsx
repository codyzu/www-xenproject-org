import {h, render} from 'preact';
import {useEffect, useState, useRef} from 'preact/hooks';
import Globe, {type GlobeMethods} from 'react-globe.gl';
import clsx from 'clsx';
import earthTopology from '../../assets/earth-topology.png';
import nightSky from '../../assets/night-sky.png';
import earthDay from '../../assets/earth-day.jpg';
import {type Job} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';
import {type Status, StatusPill} from '../HardwareGrid/StatusPill.tsx';
import useSize from './use-size.ts';

type LocationData = {
  location: string;
  lat: number;
  lng: number;
  icons: string[];
  status: Status;
  count: number;
};

type StatusValue = 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'CANCELED' | 'missing' | 'unknown';
const statusClassMap = new Map<StatusValue, string>([
  ['SUCCESS', 'uno-shadow-green-500'],
  ['FAILED', 'uno-shadow-red-500'],
  ['SKIPPED', 'uno-shadow-gray-300'],
  ['CANCELED', 'uno-shadow-yellow-300'],
  ['missing', 'uno-shadow-gray-100'],
  ['unknown', 'uno-shadow-orange-400'],
]);

function getStatusClass(status: string | undefined) {
  if (status === undefined) return statusClassMap.get('missing')!;
  return statusClassMap.get(status as StatusValue) ?? statusClassMap.get('unknown')!;
}

const northPole = {lat: 90, lng: 0};

export default function TestGlobe({jobs}: {readonly jobs: Map<string, Job[]>}) {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeContainerSize = useSize(globeContainerRef);
  const globeRef = useRef<GlobeMethods>();

  useEffect(
    () => {
      if (!globeRef.current) {
        console.warn('Globe ref is not set');
        return;
      }

      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = -1.8;
      globeRef.current.pointOfView({...northPole, altitude: 0.6});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globeRef.current],
  );

  useEffect(() => {
    if (!globeRef.current) {
      console.warn('Globe ref is not set');
      return;
    }

    if (jobs.size === 0) {
      console.warn('No jobs found');
      return;
    }

    const firstLocation = [...jobs.values()][0][0];
    globeRef.current.pointOfView({lat: firstLocation.lat, lng: firstLocation.lng, altitude: 1.8}, 3000);
  }, [jobs]);

  const locations: LocationData[] = [];
  for (const [location, locationJobs] of jobs.entries()) {
    const icons = [...new Set(locationJobs.flatMap((j) => j.icons))];

    // Keep the 64-bit CPU icon at the end of the icons array
    if (icons.includes('i-mdi-cpu-64-bit')) {
      icons.splice(icons.indexOf('i-mdi-cpu-64-bit'), 1);
      icons.push('i-mdi-cpu-64-bit');
    }

    const status: Status = locationJobs.every((j) => j.raw.status === 'SUCCESS')
      ? 'SUCCESS'
      : locationJobs.some((j) => j.raw.status === 'FAILED')
        ? 'FAILED'
        : 'PENDING';

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
    const endPoints: Array<{lat: number; lng: number}> = [...jobs.values()].map((jobGroup) => ({
      lat: jobGroup[0].lat,
      lng: jobGroup[0].lng,
    }));

    const combinations = endPoints.flatMap((start, startIndex) =>
      endPoints.filter((end, endIndex) => start !== end && endIndex > startIndex).map((end) => ({start, end})),
    );

    const nextArcData = combinations.map(({start, end}) => ({
      startLat: start.lat,
      startLng: start.lng,
      endLat: end.lat,
      endLng: end.lng,
    }));

    setArcData(nextArcData);
  }, [jobs]);

  return (
    <div className="uno-w-full uno-h-120 uno-flex uno-self-center uno-relative uno-animate-jello uno-animate-duration-600 uno-overflow-clip">
      <div className="uno-relative uno-w-full uno-h-full uno-p-[1px] uno-flex uno-animate-fade-in">
        <div ref={globeContainerRef} className="uno-w-full uno-h-full uno-flex uno-rounded-3xl uno-overflow-hidden">
          <Globe
            ref={globeRef}
            animateIn={false}
            globeImageUrl={earthDay}
            bumpImageUrl={earthTopology}
            backgroundImageUrl={nightSky}
            width={globeContainerSize?.width ?? 0}
            height={globeContainerSize?.height ?? 0}
            htmlElementsData={locations}
            htmlElement={renderLocationHtmlElement}
            arcsData={arcData}
            arcStroke={2}
            arcAltitudeAutoScale={0.25}
            arcColor={['#f87171', '#fbbf24', '#4ade80', '#fbbf24', '#f87171']}
            arcDashGap={0.01}
            arcDashLength={0.05}
            arcDashAnimateTime={2000}
            arcsTransitionDuration={500}
            backgroundColor="#000000"
          />
        </div>
      </div>
      <div className="uno-absolute uno-z-10 uno-top-0 uno-left-0 uno-w-full uno-h-full uno-shadow-fade-in uno-shadow-surface-secondary uno-pointer-events-none uno-rounded-3xl" />
    </div>
  );
}

function renderLocationHtmlElement(data: unknown) {
  const location = data as LocationData;
  const element = document.createElement('div');
  render(
    <div
      className={clsx(
        'uno-card uno-bg-opacity-80 uno-flex uno-flex-col uno-items-center uno-gap-1',
        getStatusClass(location.status),
      )}
    >
      <div className="uno-text-sm uno-font-semibold">{location.location}</div>
      <StatusPill status={location.status} label={location.status.toLowerCase()} />
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
}
