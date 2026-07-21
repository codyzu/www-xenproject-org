import type {PlatformLayersDiagramData} from '../components/diagrams/platform-layers';

export const cloudInfrastructurePlatformLayersDiagram: PlatformLayersDiagramData = {
  title: 'Infrastructure layers',
  metaLabel: 'Operator-controlled stack',
  variant: 'hero',
  summary:
    'Xen gives infrastructure teams a visible boundary between cloud workloads, virtual machines, the hypervisor, and owned hardware.',
  layers: [
    {
      title: 'Cloud workloads',
      eyebrow: 'Services',
      tone: 'applications',
      description: 'Infrastructure workloads remain subject to operator-owned control and lifecycle decisions.',
      items: [
        {label: 'Web services', icon: 'i-carbon-container-services'},
        {label: 'Databases', icon: 'i-carbon-data-base-alt'},
        {label: 'AI workers', icon: 'i-carbon-machine-learning-model'},
        {label: 'Network functions', icon: 'i-carbon-network-4'},
      ],
    },
    {
      title: 'Virtual machines',
      eyebrow: 'Guests',
      tone: 'guests',
      description: 'Diverse guest systems keep tenant, service, appliance, and build lifecycles distinct.',
      items: [
        {label: 'Linux VM', icon: 'i-carbon-linux'},
        {label: 'Windows VM', icon: 'i-carbon-logo-windows'},
        {label: 'Appliance VM', icon: 'i-carbon-virtual-machine'},
        {label: 'Build agents', icon: 'i-carbon-code'},
      ],
    },
    {
      title: 'Xen hypervisor',
      eyebrow: 'Virtualization boundary',
      tone: 'xen',
      emphasis: 'primary',
      description: 'Guest isolation, scheduling, device ownership, and control domains stay explicit.',
    },
    {
      title: 'Hardware',
      eyebrow: 'Owned infrastructure',
      tone: 'hardware',
      description: 'Compute, memory, storage, networking, and accelerators remain operator-owned decisions.',
      items: [
        {label: 'Compute', icon: 'i-carbon-chip'},
        {label: 'Storage', icon: 'i-carbon-data-base-alt'},
        {label: 'Networking', icon: 'i-carbon-network-4'},
        {label: 'Accelerators', icon: 'i-carbon-chip'},
      ],
    },
  ],
};

export const cloudInfrastructureEcosystemLayersDiagram: PlatformLayersDiagramData = {
  title: 'Xen-centered ecosystem',
  metaLabel: 'One open foundation',
  summary: 'Infrastructure platforms can build above XAPI while Xen remains the open foundation on owned hardware.',
  layers: [
    {
      title: 'Platforms and services',
      eyebrow: 'Built on Xen',
      tone: 'applications',
      description: 'XCP-ng, operations tooling, and commercial services occupy distinct roles above one foundation.',
      items: [
        {label: 'XCP-ng', icon: 'i-carbon-cube'},
        {label: 'Operations tooling', icon: 'i-carbon-dashboard'},
        {label: 'Commercial services', icon: 'i-carbon-enterprise'},
      ],
    },
    {
      title: 'XAPI management toolstack',
      eyebrow: 'Xen Project tooling',
      tone: 'guests',
      description: 'XAPI manages VM lifecycle, pools, and migration for Xen-based platforms.',
      items: [
        {label: 'VM lifecycle', icon: 'i-carbon-virtual-machine'},
        {label: 'Pools', icon: 'i-carbon-data-center'},
        {label: 'Migration', icon: 'i-carbon-migrate'},
      ],
    },
    {
      title: 'Xen hypervisor',
      eyebrow: 'Virtualization foundation',
      tone: 'xen',
      emphasis: 'primary',
      description: 'Xen provides the open hypervisor boundary the ecosystem builds on.',
      items: [
        {label: 'Isolation', icon: 'i-carbon-security'},
        {label: 'Scheduling', icon: 'i-carbon-time'},
        {label: 'Device ownership', icon: 'i-carbon-connect'},
      ],
    },
    {
      title: 'Hardware',
      eyebrow: 'Infrastructure estate',
      tone: 'hardware',
      description: 'Servers, storage, networks, and accelerators remain operator-owned inputs.',
      items: [
        {label: 'CPU', icon: 'i-carbon-chip'},
        {label: 'Memory', icon: 'i-carbon-data-base-alt'},
        {label: 'I/O', icon: 'i-carbon-network-4'},
      ],
    },
  ],
};
