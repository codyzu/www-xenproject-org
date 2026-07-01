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
      description: 'AGL, IVI, custom apps, telemetry, diagnostics, and OTA services run above guest environments.',
      receivesShadow: false,
      itemsLabel: 'Example application and service workloads',
      items: [
        {label: 'AGL / IVI', icon: 'i-carbon-car'},
        {label: 'Telemetry', icon: 'i-carbon-meter'},
        {label: 'OTA', icon: 'i-carbon-cloud-upload'},
      ],
    },
    {
      title: 'Guest systems',
      eyebrow: 'Operating environments',
      tone: 'guests',
      description:
        'Linux built with Yocto Project, Zephyr or RTOS workloads, and service domains retain distinct roles.',
      itemsLabel: 'Example guest systems',
      items: [
        {label: 'Yocto Linux', icon: 'i-carbon-linux'},
        {label: 'Zephyr / RTOS', icon: 'i-carbon-chip'},
        {label: 'Service domain', icon: 'i-carbon-container-services'},
      ],
    },
    {
      title: 'Xen virtualization',
      eyebrow: 'Isolation boundary',
      tone: 'xen',
      description: 'Xen supplies the hypervisor boundary for isolation, ownership, and resource-control decisions.',
      itemsLabel: 'Xen platform responsibilities',
      items: [
        {label: 'Hypervisor', icon: 'i-carbon-layers'},
        {label: 'Isolation', icon: 'i-carbon-security'},
        {label: 'Resources', icon: 'i-carbon-data-structured'},
      ],
    },
    {
      title: 'Hardware / SoC platform',
      eyebrow: 'Shared compute',
      tone: 'hardware',
      description: 'CPU, memory, interrupts, devices, and peripherals come from the embedded or automotive SoC.',
      itemsLabel: 'Shared platform resources',
      items: [
        {label: 'CPU', icon: 'i-carbon-chip'},
        {label: 'Memory', icon: 'i-carbon-memory'},
        {label: 'Devices', icon: 'i-carbon-connect'},
      ],
    },
  ],
};
