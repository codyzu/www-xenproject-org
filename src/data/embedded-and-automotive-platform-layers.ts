import type {PlatformLayersDiagramData} from '../components/diagrams/platform-layers';

export const embeddedAutomotivePlatformLayersDiagram: PlatformLayersDiagramData = {
  title: 'Platform layers',
  eyebrow: 'Platform layers',
  metaLabel: 'CSS layer model',
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
