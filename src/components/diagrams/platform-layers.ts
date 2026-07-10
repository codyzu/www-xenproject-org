export type PlatformLayerTone = 'applications' | 'guests' | 'xen' | 'hardware';

export type PlatformLayerItem = {
  label: string;
  icon?: string;
};

export type PlatformLayerData = {
  title: string;
  eyebrow?: string;
  tone?: PlatformLayerTone;
  emphasis?: 'primary';
  description: string;
  items?: PlatformLayerItem[];
  itemsLabel?: string;
  receivesShadow?: boolean;
};

export type PlatformLayersDiagramVariant = 'standard' | 'hero';
export type PlatformLayersFrameBleed = 'none' | 'subtle';

export type PlatformLayersDiagramData = {
  title: string;
  eyebrow?: string;
  metaLabel?: string;
  summary: string;
  layers: PlatformLayerData[];
  variant?: PlatformLayersDiagramVariant;
  /**
   * Allows a restrained inline-start and bottom bleed when the diagram is used
   * as a primary architectural visual.
   */
  frameBleed?: PlatformLayersFrameBleed;
};
