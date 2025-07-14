import {useEffect, useState, useRef, useMemo} from 'react';
import Globe, {type GlobeMethods} from 'react-globe.gl';
import clsx from 'clsx';
import {createRoot} from 'react-dom/client';
import earthTopology from '../../assets/earth-topology.png';
import nightSky from '../../assets/night-sky.png';
import earthDay from '../../assets/earth-day.jpg';
import {StatusPill} from './StatusPill.tsx';
import {type Location} from './gitlab-jobs.ts';
import {type JobLocation} from './use-gitlab-pipeline-jobs.ts';
import useSize from './use-size.ts';

type StatusValue = 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'CANCELED' | 'missing' | 'unknown';
const statusClassMap = new Map<StatusValue, string>([
  ['SUCCESS', 'uno-shadow-green-500'],
  ['FAILED', 'uno-shadow-red-500'],
  ['SKIPPED', 'uno-shadow-gray-300'],
  ['CANCELED', 'uno-shadow-yellow-300'],
  ['missing', 'uno-shadow-gray-100'],
  ['unknown', 'uno-shadow-orange-400'],
]);

function traversePaths(points: Array<{lat: number; lng: number}>) {
  const combinations = points.flatMap((start, startIndex) =>
    points.filter((end, endIndex) => start !== end && endIndex > startIndex).map((end) => ({start, end})),
  );

  const paths = combinations.map(({start, end}) => ({
    startLat: start.lat,
    startLng: start.lng,
    endLat: end.lat,
    endLng: end.lng,
  }));

  return paths;
}

function getStatusClass(status: string | undefined) {
  if (status === undefined) return statusClassMap.get('missing')!;
  return statusClassMap.get(status as StatusValue) ?? statusClassMap.get('unknown')!;
}

const northPole = {lat: 90, lng: 0};

export default function TestGlobe({locations}: {readonly locations: Map<string, JobLocation>}) {
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeContainerSize = useSize(globeContainerRef);
  const globeRef = useRef<GlobeMethods>(undefined);

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

  const arcData = useMemo(() => {
    const hardwareLocations = new Map<string, Location>();
    const qemuLocations = new Map<string, Location>();

    for (const [location, jobLocation] of locations.entries()) {
      const hardwareJob = jobLocation.jobs.find((job) => job.jobType === 'hardware');
      const qemuJob = jobLocation.jobs.find((job) => job.jobType === 'qemu');

      if (hardwareJob) {
        hardwareLocations.set(location, hardwareJob.location);
      }

      if (qemuJob) {
        qemuLocations.set(location, qemuJob.location);
      }
    }

    const hardwareArcs = traversePaths([...hardwareLocations.values()]).map((path) => ({
      ...path,
      color: ['#2dd4bf', '#fbbf24', '#f87171', '#fbbf24', '#2dd4bf'],
      scale: 0.45,
    }));
    const qemuArcs = traversePaths([...qemuLocations.values()]).map((path) => ({
      ...path,
      color: ['#38bdf8', '#a78bfa', '#e879f9', '#a78bfa', '#38bdf8'],
      scale: 0.35,
    }));

    return [...hardwareArcs, ...qemuArcs];
  }, [locations]);

  const [isFirstLocationVisible, setIsFirstLocationVisible] = useState(false);
  useEffect(() => {
    if (!globeRef.current) {
      console.warn('Globe ref is not set');
      return;
    }

    if (isFirstLocationVisible) {
      return;
    }

    const firstLocation = [...locations.values()].at(0);

    if (!firstLocation) {
      console.warn('No first location found');
      return;
    }

    globeRef.current.pointOfView(
      {lat: firstLocation.location.lat, lng: firstLocation.location.lng, altitude: 1.8},
      3000,
    );

    setIsFirstLocationVisible(true);
  }, [locations, isFirstLocationVisible]);

  return (
    <div className="uno-flex uno-flex-col">
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
              htmlElementsData={[...locations.values()]}
              htmlElement={renderLocationHtmlElement}
              htmlLat={(data) => (data as JobLocation).location.lat}
              htmlLng={(data) => (data as JobLocation).location.lng}
              arcsData={arcData}
              arcStroke={2}
              arcAltitudeAutoScale="scale"
              arcColor="color"
              arcDashGap={0.004}
              arcDashLength={0.01}
              arcDashAnimateTime={8000}
              arcsTransitionDuration={500}
              backgroundColor="#000000"
            />
          </div>
        </div>
        <div className="uno-absolute uno-z-10 uno-top-0 uno-left-0 uno-w-full uno-h-full uno-shadow-fade-in uno-shadow-surface-secondary uno-pointer-events-none uno-rounded-3xl" />
      </div>
    </div>
  );
}

function LocationCard({jobs}: {readonly jobs: JobLocation}) {
  const hardwareJobs = jobs.jobs.filter((j) => j.jobType === 'hardware');

  // Combine all hardware icons into a single set, sorted by weight
  const hardwareIcons = [
    ...new Set(
      hardwareJobs
        .flatMap((j) => j.icons)
        .toSorted((a, b) => a.weight - b.weight)
        .map((i) => i.className),
    ),
  ].toReversed();

  const qemuJobs = jobs.jobs.filter((j) => j.jobType === 'qemu');

  // Combine all qemu icons into a single set, sorted by weight
  const qemuIcons = [
    ...new Set(
      qemuJobs
        .flatMap((j) => j.icons)
        .toSorted((a, b) => a.weight - b.weight)
        .map((i) => i.className),
    ),
  ].toReversed();

  return (
    <div
      className={clsx(
        'uno-bg-opacity-80 uno-flex uno-flex-col uno-items-center uno-gap-1 uno-p-y-1',
        'uno-rounded-lg uno-bg-surface-secondary uno-shadow-lg uno-overflow-hidden',
        getStatusClass(jobs.status),
      )}
    >
      <div className="uno-flex uno-flex-col uno-text-xs">
        <div className="uno-flex uno-flex-row uno-items-center uno-gap-2 uno-p-x-2">
          <div className="uno-text-xs uno-font-semibold">{jobs.location.name}</div>
          <StatusPill status={jobs.status} label={jobs.status.toLowerCase()} />
        </div>

        {hardwareJobs.length > 0 && (
          <>
            <div className="uno-p-l-2 uno-m-t-2">Hardware Tests</div>
            <div className="uno-h-2 uno-w-full uno-bg-gradient-to-r uno-bg-gradient-from-teal-400 uno-bg-gradient-via-amber-400 uno-bg-gradient-to-red-400" />
            <div className="uno-self-center uno-m-t-1 uno-grid uno-grid-cols-3 uno-gap-1 uno-text-secondary">
              {hardwareIcons.map((icon) => (
                <div
                  key={icon}
                  className={clsx(
                    'uno-rounded uno-border-1 uno-border-solid uno-border-black uno-flex uno-shadow-xl uno-shadow-gray-400 uno-p-1 uno-w-auto uno-h-auto',
                  )}
                >
                  <div className={clsx(icon, 'uno-w-8 uno-h-8')} />
                </div>
              ))}
            </div>
          </>
        )}
        {qemuJobs.length > 0 && (
          <>
            <div className="uno-p-l-2 uno-m-t-2">Qemu Tests</div>
            <div className="uno-h-2 uno-w-full uno-bg-gradient-to-r uno-bg-gradient-from-sky-400 uno-bg-gradient-via-violet-400 uno-bg-gradient-to-fuchsia-400" />
            <div className="uno-self-center uno-m-t-1 uno-grid uno-grid-cols-3 uno-gap-1 uno-text-secondary">
              {qemuIcons.map((icon) => (
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
          </>
        )}
      </div>
    </div>
  );
}

function renderLocationHtmlElement(data: unknown) {
  const locationJobs = data as JobLocation;
  const element = document.createElement('div');
  createRoot(element).render(<LocationCard jobs={locationJobs} />);
  return element;
}
