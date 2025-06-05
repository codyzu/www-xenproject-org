import intelI7 from '../../assets/core-i7.png';
import ryzenEmbedded from '../../assets/ryzen-embedded.png';
import ultrascale from '../../assets/ultrascale.webp';
import zen2 from '../../assets/zen-2.png';
import zen3 from '../../assets/zen-3.svg';
import zen4 from '../../assets/zen-4.png';
import intelI5 from '../../assets/core-i5.png';
import qemu from '../../assets/qemu.png';

export type Location = {
  name: string;
  lat: number;
  lng: number;
};

type Icon = {
  className: string;
  weight: number;
};

type PlatformLocation = {
  jobName: RegExp;
  platform: string;
  jobType?: 'hardware' | 'qemu' | undefined;
  locations: Location[];
  icon?: Icon;
  image: string;
};

const platformLocations: PlatformLocation[] = [
  {
    jobName: /^adl/i,
    platform: 'Intel Alder Lake (i5-12600K)',
    jobType: 'hardware',
    locations: [
      {
        name: 'Berlin',
        lat: 52.52,
        lng: 13.405,
      },
    ],
    icon: {className: 'i-lineicons-intel', weight: 50},
    image: intelI5,
  },
  {
    jobName: /^kbl/i,
    platform: 'Intel Kaby Lake (i7-7567U)',
    jobType: 'hardware',
    locations: [
      {
        name: 'Berlin',
        lat: 52.52,
        lng: 13.405,
      },
    ],
    icon: {className: 'i-lineicons-intel', weight: 50},
    image: intelI7,
  },
  {
    jobName: /^zen2/i,
    platform: 'AMD Zen 2 (Ryzen 5 4500U)',
    jobType: 'hardware',
    locations: [
      {
        name: 'Berlin',
        lat: 52.52,
        lng: 13.405,
      },
    ],
    icon: {className: 'i-lineicons-amd', weight: 50},
    image: zen2,
  },
  {
    jobName: /^zen3p/i,
    platform: 'AMD Zen 3+ (Ryzen 7 7735HS)',
    jobType: 'hardware',
    locations: [
      {
        name: 'Berlin',
        lat: 52.52,
        lng: 13.405,
      },
    ],
    icon: {className: 'i-lineicons-amd', weight: 50},
    image: zen3,
  },
  {
    jobName: /^zen4/i,
    platform: 'AMD Zen 4 (Ryzen 5 7640U)',
    jobType: 'hardware',
    locations: [
      {
        name: 'Berlin',
        lat: 52.52,
        lng: 13.405,
      },
    ],
    icon: {className: 'i-lineicons-amd', weight: 50},
    image: zen4,
  },
  {
    jobName: /^xilinx.*arm64/i,
    platform: 'Xilinx Ultrascale+ MPSoC (ARM64)',
    jobType: 'hardware',
    locations: [
      {
        name: 'San Jose',
        lat: 37.3382,
        lng: -121.8863,
      },
    ],
    icon: {className: 'i-file-icons-arm', weight: 50},
    image: ultrascale,
  },
  {
    jobName: /^xilinx(?!.*arm64)/i,
    platform: 'AMD Ryzen Embedded v2000',
    jobType: 'hardware',
    locations: [
      {
        name: 'San Jose',
        lat: 37.3382,
        lng: -121.8863,
      },
    ],
    icon: {className: 'i-lineicons-amd', weight: 50},
    image: ryzenEmbedded,
  },
  {
    jobName: /^qemu/i,
    platform: 'QEMU emulated',
    jobType: 'qemu',
    locations: [
      {
        name: 'San Jose',
        lat: 37.3382,
        lng: -121.8863,
      },
      {
        name: 'Berlin',
        lat: 52.52,
        lng: 13.405,
      },
      {
        name: 'Boston',
        lat: 42.3601,
        lng: -71.0589,
      },
    ],
    // Icon: {className: 'i-carbon-virtual-machine', weight: 40},
    image: qemu,
  },

  // Add other locations here 👆

  // Icons are added in the order matched, so keep the 64bit icon for last
  {
    jobName: /64/,
    platform: '',
    icon: {className: 'i-mdi-cpu-64-bit', weight: 10},
    locations: [],
    image: '',
  },
  {
    jobName: /32/,
    platform: '',
    icon: {className: 'i-mdi-cpu-32-bit', weight: 11},
    locations: [],
    image: '',
  },
  {
    jobName: /arm/i,
    platform: '',
    icon: {className: 'i-file-icons-arm', weight: 20},
    locations: [],
    image: '',
  },
];

export type JobData = Omit<PlatformLocation, 'jobName' | 'icon'> & {icons: Icon[]};

export function parseJobData(jobName: string): JobData {
  let platform = '';
  let locations: Array<{name: string; lat: number; lng: number}> = [];
  let icons: Icon[] = [];
  let image = '';
  let jobType: 'hardware' | 'qemu' | undefined;

  for (const platformLocation of platformLocations) {
    if (platformLocation.jobName.test(jobName)) {
      platform = `${platform} ${platformLocation.platform ?? ''}`;

      locations = [...locations, ...(platformLocation.locations ?? [])];
      icons = platformLocation.icon ? [...icons, platformLocation.icon] : icons;
      image = platformLocation.image || image;
      jobType = platformLocation.jobType ?? jobType;
    }
  }

  const sortedIcons = [
    ...new Map(
      icons
        // Sort by lowest to highest weight
        .toSorted((a, b) => a.weight - b.weight)
        // Remove duplicates by className (using Map), keeping the highest weight
        .map((icon) => [icon.className, icon]),
    ).values(),
  ]
    // Finally, reverse the order from highest to lowest weight
    .toReversed();

  return {
    platform: platform.trim(),
    locations,
    icons: sortedIcons,
    image,
    jobType,
  };
}
