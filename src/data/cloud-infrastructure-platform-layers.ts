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
  title: 'Open infrastructure stack',
  eyebrow: 'Platform composition',
  metaLabel: 'Assembled stack',
  summary:
    'Infrastructure teams can compose management and operations tooling with XAPI, XCP-ng, the Xen hypervisor, and owned hardware.',
  layers: [
    {
      title: 'Management and operations',
      eyebrow: 'Operations layer',
      tone: 'applications',
      description:
        'Provisioning, monitoring, backup, orchestration, and policy tools sit above the virtualization platform.',
      receivesShadow: false,
      itemsLabel: 'Example operations concerns',
      items: [
        {label: 'Provisioning', icon: 'i-carbon-deployment-pattern'},
        {label: 'Monitoring', icon: 'i-carbon-chart-line'},
        {label: 'Backup', icon: 'i-carbon-data-backup'},
      ],
    },
    {
      title: 'XAPI / XCP-ng platform layer',
      eyebrow: 'Platform tooling',
      tone: 'guests',
      description:
        'XAPI exposes management capabilities, while XCP-ng packages a complete open virtualization platform.',
      itemsLabel: 'Platform capabilities',
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
      description: 'Xen provides the open hypervisor boundary that infrastructure platforms build on.',
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
