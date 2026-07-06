import type {PlatformLayersDiagramData} from '../components/diagrams/platform-layers';

export const safetyCriticalPlatformLayersDiagram: PlatformLayersDiagramData = {
  title: 'Safety-conscious platform layers',
  eyebrow: 'Inspectable boundaries',
  metaLabel: 'Certification-oriented architecture',
  variant: 'hero',
  summary:
    'Xen helps separate safety-conscious workloads, non-critical services, guest domains, the hypervisor boundary, and hardware resources so architecture and evidence responsibilities stay visible.',
  layers: [
    {
      title: 'Safety-critical workloads',
      eyebrow: 'Functions',
      tone: 'applications',
      description: 'Control, monitoring, and supervision workloads need clear boundaries and reviewable assumptions.',
      receivesShadow: false,
      itemsLabel: 'Example safety-conscious functions',
      items: [
        {label: 'Control', icon: 'i-carbon-settings-adjust'},
        {label: 'Monitoring', icon: 'i-carbon-chart-line'},
        {label: 'Supervision', icon: 'i-carbon-rule'},
      ],
    },
    {
      title: 'Non-critical services',
      eyebrow: 'Platform services',
      tone: 'applications',
      description:
        'Linux services, diagnostics, HMI, telemetry, and update agents can have different validation needs.',
      itemsLabel: 'Example non-critical services',
      items: [
        {label: 'Diagnostics', icon: 'i-carbon-test-tool'},
        {label: 'HMI', icon: 'i-carbon-dashboard'},
        {label: 'OTA', icon: 'i-carbon-download'},
      ],
    },
    {
      title: 'Guest domains',
      eyebrow: 'Operating environments',
      tone: 'guests',
      description:
        'Guest systems and service domains keep runtime, ownership, update, and validation boundaries explicit.',
      itemsLabel: 'Example guest domains',
      items: [
        {label: 'RTOS', icon: 'i-carbon-chip'},
        {label: 'Linux', icon: 'i-carbon-linux'},
        {label: 'Services', icon: 'i-carbon-container-services'},
      ],
    },
    {
      title: 'Xen hypervisor boundary',
      eyebrow: 'Controlled boundary',
      tone: 'xen',
      description: 'Isolation, CPU assignment, device ownership, and interrupt routing are platform design inputs.',
      itemsLabel: 'Xen platform responsibilities',
      items: [
        {label: 'Isolation', icon: 'i-carbon-security'},
        {label: 'CPU assignment', icon: 'i-carbon-chip'},
        {label: 'Devices', icon: 'i-carbon-connect'},
      ],
    },
    {
      title: 'Hardware / SoC platform',
      eyebrow: 'Shared platform inputs',
      tone: 'hardware',
      description: 'Compute, memory, interrupts, devices, and peripherals remain part of the system evidence story.',
      itemsLabel: 'Shared platform resources',
      items: [
        {label: 'CPU', icon: 'i-carbon-chip'},
        {label: 'Memory', icon: 'i-carbon-data-base-alt'},
        {label: 'Interrupts', icon: 'i-carbon-time'},
        {label: 'Devices', icon: 'i-carbon-connect'},
      ],
    },
  ],
};
