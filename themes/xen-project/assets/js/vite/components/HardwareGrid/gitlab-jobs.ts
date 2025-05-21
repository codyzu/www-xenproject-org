type PlatformLocation = {
  jobName: RegExp;
  platform?: string;
  location?: string;
  lat?: number;
  lng?: number;
  icons?: string[];
};

const platformLocations: PlatformLocation[] = [
  {
    jobName: /^adl/i,
    platform: 'Intel Alder Lake (i5-12600K)',
    location: 'Berlin',
    lat: 52.52,
    lng: 13.405,
    icons: ['i-lineicons-intel'],
  },
  {
    jobName: /^kbl/i,
    platform: 'Intel Kaby Lake (i7-7567U)',
    location: 'Berlin',
    lat: 52.52,
    lng: 13.405,
    icons: ['i-lineicons-intel'],
  },
  {
    jobName: /^zen2/i,
    platform: 'AMD Zen 2 (Ryzen 5 4500U)',
    location: 'Boston',
    lat: 42.3601,
    lng: -71.0589,
    icons: ['i-lineicons-amd'],
  },
  {
    jobName: /^zen3p/i,
    platform: 'AMD Zen 3+ (Ryzen 7 7735HS)',
    location: 'Boston',
    lat: 42.3601,
    lng: -71.0589,
    icons: ['i-lineicons-amd'],
  },
  {
    jobName: /^zen4/i,
    platform: 'AMD Zen 4 (Ryzen 5 7640U)',
    location: 'Boston',
    lat: 42.3601,
    lng: -71.0589,
    icons: ['i-lineicons-amd'],
  },
  {
    jobName: /^xilinx.*arm64/i,
    platform: 'Xilinx Ultrascale+ MPSoC (ARM64)',
    icons: ['i-file-icons-arm'],
    location: 'San Jose',
    lat: 37.3382,
    lng: -121.8863,
  },
  {
    jobName: /^xilinx(?!.*arm64)/i,
    platform: 'AMD Ryzen Embedded v2000',
    icons: ['i-lineicons-amd'],
    location: 'San Jose',
    lat: 37.3382,
    lng: -121.8863,
  },

  // Add other locations here 👆

  // Icons are added in the order matched, so keep the 64bit icon for last
  {
    jobName: /64/,
    icons: ['i-mdi-cpu-64-bit'],
  },
];

export type JobData = Required<Pick<PlatformLocation, 'platform' | 'location' | 'lat' | 'lng' | 'icons'>> &
  Omit<PlatformLocation, 'jobName'>;

export function parseJobData(jobName: string): JobData {
  let platform = '';
  let location = '';
  let lat = 0;
  let lng = 0;
  let icons: string[] = [];

  for (const platformLocation of platformLocations) {
    if (platformLocation.jobName.test(jobName)) {
      platform = `${platform} ${platformLocation.platform ?? ''}`;
      location = !location && platformLocation.location ? platformLocation.location : location;
      lat = !lat && platformLocation.lat ? platformLocation.lat : lat;
      lng = !lng && platformLocation.lng ? platformLocation.lng : lng;
      icons = [...icons, ...(platformLocation.icons ?? [])];
    }
  }

  // Console.log(jobName, 'name', platform, 'city', city, 'lat', lat, 'lng', lng, 'icons', icons);

  return {
    platform: platform.trim(),
    location,
    lat,
    lng,
    icons,
  };
}
