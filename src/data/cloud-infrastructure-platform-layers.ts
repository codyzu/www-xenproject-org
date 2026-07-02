import type {PlatformLayersDiagramData} from '../components/diagrams/platform-layers';

export const cloudInfrastructurePlatformLayersDiagram: PlatformLayersDiagramData = {
  title: 'Infrastructure layers',
  eyebrow: 'Infrastructure layers',
  metaLabel: 'Exploded Architecture',
  variant: 'hero',
  summary:
    'Xen gives cloud and infrastructure platforms a visible boundary between applications, virtual machines, the hypervisor, and hardware.',
  layers: [
    {
      title: 'Applications and services',
      eyebrow: 'Workloads',
      tone: 'applications',
      description: 'Application software runs above infrastructure-owned virtualization and lifecycle boundaries.',
      receivesShadow: false,
      itemsLabel: 'Example infrastructure workloads',
      items: [
        {label: 'Services', icon: 'i-carbon-container-services'},
        {label: 'Databases', icon: 'i-carbon-data-base-alt'},
        {label: 'Networks', icon: 'i-carbon-network-4'},
      ],
    },
    {
      title: 'Virtual machines',
      eyebrow: 'Guests',
      tone: 'guests',
      description: 'Guest operating systems keep tenant, service, and platform responsibilities separated.',
      itemsLabel: 'Example guest environments',
      items: [
        {label: 'Linux', icon: 'i-carbon-linux'},
        {label: 'Windows', icon: 'i-carbon-logo-windows'},
        {label: 'BSD', icon: 'i-carbon-virtual-machine'},
      ],
    },
    {
      title: 'Xen hypervisor',
      eyebrow: 'Virtualization boundary',
      tone: 'xen',
      description: 'Guest isolation, scheduling, device ownership, and control-domain choices stay explicit.',
    },
    {
      title: 'Hardware',
      eyebrow: 'Owned infrastructure',
      tone: 'hardware',
      description: 'Compute, memory, storage, networking, and accelerator resources remain platform design inputs.',
    },
  ],
};

export const cloudInfrastructureEcosystemLayersDiagram: PlatformLayersDiagramData = {
  title: 'Xen-centered infrastructure stack',
  eyebrow: 'Ecosystem layers',
  metaLabel: 'Layered stack',
  summary:
    'Infrastructure platforms and services can build above XAPI and other platform tooling, while Xen remains the open virtualization foundation on owned hardware.',
  layers: [
    {
      title: 'Platforms and services',
      eyebrow: 'Built on Xen',
      tone: 'applications',
      description:
        'XCP-ng, operations tooling, and commercial services can build complete platform experiences around the same open foundation.',
      receivesShadow: false,
      itemsLabel: 'Example platform and service layers',
      items: [
        {label: 'XCP-ng', icon: 'i-carbon-cube'},
        {label: 'Xen Orchestra', icon: 'i-carbon-dashboard'},
        {label: 'Commercial services', icon: 'i-carbon-enterprise'},
      ],
    },
    {
      title: 'XAPI management toolstack',
      eyebrow: 'Xen Project tooling',
      tone: 'guests',
      description:
        'XAPI is a Xen Project toolstack and management layer for configuring and controlling Xen-based platforms.',
      itemsLabel: 'XAPI platform responsibilities',
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
      description: 'Xen provides the open hypervisor boundary that the surrounding ecosystem builds on.',
      itemsLabel: 'Hypervisor responsibilities',
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
      description: 'Servers, storage, networks, and accelerators remain under the operator platform model.',
      itemsLabel: 'Infrastructure resources',
      items: [
        {label: 'CPU', icon: 'i-carbon-chip'},
        {label: 'Memory', icon: 'i-carbon-data-base-alt'},
        {label: 'I/O', icon: 'i-carbon-network-4'},
      ],
    },
  ],
};
