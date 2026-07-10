import type {PlatformLayersDiagramData} from '../components/diagrams/platform-layers';

export const embeddedAutomotivePlatformLayersDiagram: PlatformLayersDiagramData = {
  title: 'Platform layers',
  eyebrow: 'Platform layers',
  metaLabel: 'Exploded Architecture',
  variant: 'hero',
  summary:
    'Xen separates application workloads, guest domains, hypervisor control, and shared hardware into visible platform layers.',
  layers: [
    {
      title: 'Applications',
      eyebrow: 'User space',
      tone: 'applications',
      description: 'Application software sits above platform-owned boundaries instead of defining them.',
      receivesShadow: false,
    },
    {
      title: 'Guest systems',
      eyebrow: 'Domains',
      tone: 'guests',
      description: 'Linux, RTOS workloads, and service domains can keep separate runtime and hardware assumptions.',
      itemsLabel: 'Example guest domains',
      items: [
        {label: 'Linux', icon: 'i-carbon-linux'},
        {label: 'RTOS', icon: 'i-carbon-chip'},
        {label: 'Services', icon: 'i-carbon-container-services'},
      ],
    },
    {
      title: 'Xen hypervisor',
      eyebrow: 'Isolation boundary',
      tone: 'xen',
      emphasis: 'primary',
      description: 'Scheduling, isolation, device assignment, and platform control stay visible close to hardware.',
    },
    {
      title: 'Hardware platform',
      eyebrow: 'Shared compute',
      tone: 'hardware',
      description:
        'Compute, memory, interrupts, peripherals, and SoC integration remain explicit system design inputs.',
    },
  ],
};

export const embeddedAutomotiveEcosystemLayersDiagram: PlatformLayersDiagramData = {
  title: 'Open platform stack',
  eyebrow: 'Platform composition',
  metaLabel: 'Open stack',
  summary:
    'A complete embedded or automotive platform can place applications and services above guest systems, use Xen as the virtualization and isolation layer, and run on shared hardware or SoC resources.',
  layers: [
    {
      title: 'Applications and services',
      eyebrow: 'Software layer',
      tone: 'applications',
      description: 'Vehicle and platform services run above guest operating environments.',
      receivesShadow: false,
      itemsLabel: 'Example application and service workloads',
      items: [
        {label: 'IVI', icon: 'i-carbon-car'},
        {label: 'Diagnostics', icon: 'i-carbon-settings-adjust'},
        {label: 'OTA', icon: 'i-carbon-download'},
        {label: 'Fleet mgmt', icon: 'i-carbon-container-services'},
      ],
    },
    {
      title: 'Guest systems',
      eyebrow: 'Operating environments',
      tone: 'guests',
      description: 'Guest operating environments keep runtime and integration roles separate.',
      itemsLabel: 'Example guest systems',
      items: [
        {label: 'Linux built with Yocto', icon: 'i-carbon-linux'},
        {label: 'Zephyr / RTOS', icon: 'i-carbon-chip'},
        {label: 'Service domains', icon: 'i-carbon-container-services'},
      ],
    },
    {
      title: 'Xen virtualization',
      eyebrow: 'Isolation boundary',
      tone: 'xen',
      emphasis: 'primary',
      description: 'Xen makes isolation and hardware ownership explicit.',
      itemsLabel: 'Xen platform responsibilities',
      items: [
        {label: 'Isolation', icon: 'i-carbon-security'},
        {label: 'CPU scheduling', icon: 'i-carbon-time'},
        {label: 'Device ownership', icon: 'i-carbon-connect'},
      ],
    },
    {
      title: 'Hardware / SoC platform',
      eyebrow: 'Shared compute',
      tone: 'hardware',
      description: 'The SoC supplies the resources every layer composes around.',
      itemsLabel: 'Shared platform resources',
      items: [
        {label: 'CPU', icon: 'i-carbon-chip'},
        {label: 'Memory', icon: 'i-carbon-data-base-alt'},
        {label: 'Devices', icon: 'i-carbon-connect'},
        {label: 'Interrupts', icon: 'i-carbon-time'},
      ],
    },
  ],
};
