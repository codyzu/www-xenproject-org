import {Fragment, h, render} from 'preact';
import {useEffect, useState, useRef, useMemo} from 'preact/hooks';
import Globe, {type GlobeMethods} from 'react-globe.gl';
import clsx from 'clsx';
import earthTopology from '../../assets/earth-topology.png';
import nightSky from '../../assets/night-sky.png';
import earthDay from '../../assets/earth-day.jpg';
import {type Job} from '../HardwareGrid/use-gitlab-pipeline-jobs.ts';
import {type Status, StatusPill} from '../HardwareGrid/StatusPill.tsx';
import Toggle from '../Toggle.tsx';
import {type Location} from '../HardwareGrid/gitlab-jobs.ts';
import useSize from './use-size.ts';

type LocationData = {
  name: string;
  lat: number;
  lng: number;
  icons: string[];
  status: Status;
  count: number;
  isQemu: boolean;
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

type Arc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
};

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

type JobWithLocation = Job & {
  location: Location;
};

export default function TestGlobe({
  jobs,
  isHwTestsVisible,
  isQemuTestsVisible,
}: {
  readonly jobs: Job[];
  readonly isHwTestsVisible: boolean;
  readonly isQemuTestsVisible: boolean;
}) {
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

  const {hardwareArcs, qemuArcs} = useMemo(() => {
    const hardwareLocations = new Map<string, Location>();
    const qemuLocations = new Map<string, Location>();

    for (const job of jobs) {
      for (const location of job.locations) {
        if (job.jobType === 'hardware') {
          if (!hardwareLocations.has(location.name)) {
            hardwareLocations.set(location.name, location);
          }
        } else if (job.jobType === 'qemu' && !qemuLocations.has(location.name)) {
          // Check if the location is already added
          qemuLocations.set(location.name, location);
        }
      }
    }

    const hardwareArcs = traversePaths([...hardwareLocations.values()]).map((path) => ({
      ...path,
      color: ['#2dd4bf', '#fbbf24', '#f87171', '#fbbf24', '#2dd4bf'],
      scale: 0.35,
    }));
    const qemuArcs = traversePaths([...qemuLocations.values()]).map((path) => ({
      ...path,
      color: ['#38bdf8', '#a78bfa', '#e879f9', '#a78bfa', '#38bdf8'],
      scale: 0.25,
    }));

    return {hardwareArcs, qemuArcs};
  }, [jobs]);

  const arcData = useMemo(() => {
    return [...(isHwTestsVisible ? hardwareArcs : []), ...(isQemuTestsVisible ? qemuArcs : [])];
  }, [hardwareArcs, isHwTestsVisible, qemuArcs, isQemuTestsVisible]);

  const currentJobs: Map<string, JobWithLocation[]> = useMemo(() => {
    if (jobs.length === 0) {
      console.warn('No jobs found');
      return new Map<string, JobWithLocation[]>();
    }

    const filteredJobs = jobs.filter((job) => {
      if (job.jobType === 'hardware') {
        return isHwTestsVisible;
      }

      if (job.jobType === 'qemu') {
        return isQemuTestsVisible;
      }

      return false;
    });

    const jobsWithLocations: JobWithLocation[] = filteredJobs.flatMap((job) =>
      job.locations.map((location) => ({
        ...job,
        location,
      })),
    );

    const locationGroupedJobs: Map<string, JobWithLocation[]> = Map.groupBy(
      jobsWithLocations,
      (job) => job.location.name,
    );

    return locationGroupedJobs;
  }, [jobs, isHwTestsVisible, isQemuTestsVisible]);

  useEffect(() => {
    if (!globeRef.current) {
      console.warn('Globe ref is not set');
      return;
    }

    const firstLocation = jobs
      .flatMap((job) => job.locations)
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .at(0);

    if (!firstLocation) {
      console.warn('No first location found');
      return;
    }

    globeRef.current.pointOfView({lat: firstLocation.lat, lng: firstLocation.lng, altitude: 1.8}, 3000);
  }, [jobs]);

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
              // Data must be an array of objects (not an array of arrays), so we map the nested array to an array of objects
              htmlElementsData={[...currentJobs.values()].map((jobs) => ({jobs}))}
              htmlElement={renderLocationHtmlElement}
              htmlLat={(data) => getJobData(data)[0].location.lat}
              htmlLng={(data) => getJobData(data)[0].location.lng}
              // HtmlLng="locations[0].location.lng"
              arcsData={arcData}
              arcStroke={2}
              arcAltitudeAutoScale="scale"
              arcColor="color"
              // ArcDashGap={0.01}
              // arcDashLength={0.05}
              // arcDashAnimateTime={2000}
              arcsTransitionDuration={500}
              backgroundColor="#000000"
              // RingsData={[...locations.values()]}
              ringMaxRadius={8}
              ringColor={['#cffafe', '#ddd6fe', '#f5d0fe']}
              ringAltitude={0.01}
              ringPropagationSpeed={2}
              ringRepeatPeriod={300}
            />
          </div>
        </div>
        <div className="uno-absolute uno-z-10 uno-top-0 uno-left-0 uno-w-full uno-h-full uno-shadow-fade-in uno-shadow-surface-secondary uno-pointer-events-none uno-rounded-3xl" />
      </div>
    </div>
  );
}

function LocationCard({jobs}: {readonly jobs: JobWithLocation[]}) {
  const {location} = jobs[0];
  const statuses = new Set(jobs.map((j) => j.raw.status).filter((j) => j !== 'SKIPPED' && j !== 'CANCELED'));

  const status =
    // If only success, then set as success
    statuses.size === 1 && statuses.has('SUCCESS')
      ? 'SUCCESS'
      : // In order of priority, choose the best status
        statuses.has('FAILED')
        ? 'FAILED'
        : statuses.has('PENDING')
          ? 'PENDING'
          : statuses.has('RUNNING')
            ? 'RUNNING'
            : 'UNKNOWN';

  const hardwareJobs = jobs.filter((j) => j.jobType === 'hardware');
  const hardwareIcons = [...new Set(hardwareJobs.flatMap((j) => j.icons))];
  if (hardwareIcons.includes('i-mdi-cpu-64-bit')) {
    hardwareIcons.splice(hardwareIcons.indexOf('i-mdi-cpu-64-bit'), 1);
    hardwareIcons.push('i-mdi-cpu-64-bit');
  }

  const qemuJobs = jobs.filter((j) => j.jobType === 'qemu');
  const qemuIcons = [...new Set(qemuJobs.flatMap((j) => j.icons))];
  if (qemuIcons.includes('i-mdi-cpu-64-bit')) {
    qemuIcons.splice(qemuIcons.indexOf('i-mdi-cpu-64-bit'), 1);
    qemuIcons.push('i-mdi-cpu-64-bit');
  }

  return (
    <div
      className={clsx(
        'uno-bg-opacity-80 uno-flex uno-flex-col uno-items-center uno-gap-1 uno-p-y-1',
        'uno-rounded-lg uno-bg-surface-secondary uno-shadow-lg uno-overflow-hidden',
        getStatusClass(status),
      )}
    >
      <div className="uno-flex uno-flex-col uno-text-xs">
        <div className="uno-flex uno-flex-row uno-items-center uno-gap-2 uno-p-x-2">
          <div className="uno-text-xs uno-font-semibold">{location.name}</div>
          <StatusPill status={status} label={status.toLowerCase()} />
        </div>

        {hardwareJobs.length > 0 && (
          <Fragment>
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
          </Fragment>
        )}
        {qemuJobs.length > 0 && (
          <Fragment>
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
          </Fragment>
        )}
      </div>
    </div>
  );
}

function getJobData(data: unknown): JobWithLocation[] {
  const {jobs: locationJobs} = data as {jobs: JobWithLocation[]};
  return locationJobs;
}

function renderLocationHtmlElement(data: unknown) {
  const locationJobs = getJobData(data);
  const element = document.createElement('div');
  render(<LocationCard jobs={locationJobs} />, element);
  return element;
}
