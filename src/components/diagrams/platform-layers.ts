export type PlatformLayerTone = 'applications' | 'guests' | 'xen' | 'hardware';

export type PlatformLayerItem = {
  label: string;
  icon?: string;
};

export type PlatformLayerData = {
  title: string;
  eyebrow?: string;
  tone?: PlatformLayerTone;
  /**
   * Highlights the layer that anchors the architecture story. Today this is
   * used for the Xen boundary; add new emphasis modes only for proven cases.
   */
  emphasis?: 'primary';
  description: string;
  items?: PlatformLayerItem[];
};

export type PlatformLayersDiagramVariant = 'standard' | 'hero';

export type PlatformLayersDiagramData = {
  title: string;
  metaLabel?: string;
  /**
   * Concise accessible summary of the architecture. The visual layer order
   * should match this semantic reading order.
   */
  summary: string;
  /**
   * Variable layer counts are supported; current pages prove 4- and 5-layer
   * stacks, with responsive sizing tuned for roughly 3-6 meaningful layers.
   */
  layers: PlatformLayerData[];
  variant?: PlatformLayersDiagramVariant;
};
