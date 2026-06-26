import xenHypervisorArt from '../../assets/illustrations/layered-platform/xen-hypervisor.webp';
import type {IllustrationAssetPlan, IllustrationLayer, IllustrationSceneManifest} from './types';

export type PlatformLayer = IllustrationLayer;

export const layeredPlatformLayers: PlatformLayer[] = [
  {
    id: 'applications',
    label: 'Applications',
    description: 'Application workloads and services run at the top of the platform stack.',
    indexLabel: '01',
    accent: 'blue',
    priority: 'secondary',
    offset: 'none',
    elevation: 4,
  },
  {
    id: 'guests',
    label: 'Guest systems',
    description: 'Guest operating systems and specialized runtimes stay isolated above the hypervisor.',
    indexLabel: '02',
    accent: 'neutral',
    priority: 'secondary',
    offset: 'sm',
    elevation: 3,
  },
  {
    id: 'hypervisor',
    label: 'Xen hypervisor',
    description: 'Xen provides the focused virtualization boundary between guest systems and hardware.',
    indexLabel: '03',
    accent: 'green',
    priority: 'primary',
    offset: 'md',
    elevation: 2,
    asset: {
      src: xenHypervisorArt,
      alt: '',
      loading: 'eager',
      decoding: 'async',
      fetchpriority: 'auto',
    },
  },
  {
    id: 'hardware',
    label: 'Hardware',
    description: 'Physical platform resources form the base layer for virtualized systems.',
    indexLabel: '04',
    accent: 'neutral',
    priority: 'secondary',
    offset: 'lg',
    elevation: 1,
  },
];

export const layeredPlatformAssetPlan: IllustrationAssetPlan[] = [
  {
    id: 'core-layer-planes',
    purpose: 'Define the reusable platform stack planes for applications, guests, Xen, and hardware.',
    reuse: 'Homepage, Technology, Safety, Embedded & Automotive, Downloads.',
    preferredImplementation: ['astro', 'html', 'css', 'svg', 'transparent-webp'],
    dependencies: ['IllustrationLayerPlane', 'IllustrationGlow', 'IllustrationConnectors'],
    complexity: 'medium',
  },
  {
    id: 'isolation-boundary',
    purpose: 'Make the Xen hypervisor read as the controlled isolation boundary.',
    reuse: 'Architecture, Safety, HVMI, Embedded & Automotive pages.',
    preferredImplementation: ['svg', 'css'],
    dependencies: ['Xen green accent tokens', 'visible HTML labels'],
    complexity: 'medium',
  },
  {
    id: 'ambient-overlays',
    purpose: 'Provide restrained glow, grid, and shadow overlays without baking them into artwork.',
    reuse: 'All illustration scenes.',
    preferredImplementation: ['css', 'svg'],
    dependencies: ['foundation tokens', 'reduced-motion handling'],
    complexity: 'low',
  },
  {
    id: 'production-layer-interiors',
    purpose: 'Add premium material detail after composition and accessibility are stable.',
    reuse: 'Scene-specific, with shared style constraints.',
    preferredImplementation: ['transparent-webp', 'transparent-png', 'generated'],
    dependencies: ['optimized assets in src/assets/illustrations/layered-platform/'],
    complexity: 'high',
  },
];

export const layeredPlatformScene: IllustrationSceneManifest = {
  id: 'layered-platform',
  title: 'Layered systems',
  description:
    'Xen sits below guest systems and above hardware, providing a focused layer for virtualization and isolation decisions.',
  ariaLabel: 'Layered platform diagram showing applications, guest systems, the Xen hypervisor, and hardware',
  layers: layeredPlatformLayers,
  assetPlan: layeredPlatformAssetPlan,
  futureUse: [
    'Homepage hero platform diagram',
    'Technology architecture overview',
    'Safety and isolation boundary diagram',
    'Embedded and automotive platform stack',
    'Downloads and release flow context',
  ],
};
