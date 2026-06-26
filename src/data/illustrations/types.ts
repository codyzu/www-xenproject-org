import type {ImageMetadata} from 'astro';

export type IllustrationAccent = 'green' | 'blue' | 'neutral';
export type IllustrationMotion = 'subtle' | 'none';
export type IllustrationAssetKind =
  | 'astro'
  | 'html'
  | 'css'
  | 'svg'
  | 'transparent-webp'
  | 'transparent-png'
  | 'generated';

export type IllustrationAsset = {
  src: string | ImageMetadata;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'auto' | 'sync';
  fetchpriority?: 'high' | 'low' | 'auto';
};

export type IllustrationLayer = {
  id: string;
  label: string;
  description: string;
  indexLabel: string;
  accent: IllustrationAccent;
  priority: 'primary' | 'secondary';
  offset: 'none' | 'sm' | 'md' | 'lg';
  elevation: 1 | 2 | 3 | 4;
  asset?: IllustrationAsset;
};

export type IllustrationAssetPlan = {
  id: string;
  purpose: string;
  reuse: string;
  preferredImplementation: IllustrationAssetKind[];
  dependencies: string[];
  complexity: 'low' | 'medium' | 'high';
};

export type IllustrationSceneManifest = {
  id: string;
  title: string;
  description: string;
  ariaLabel: string;
  layers: IllustrationLayer[];
  assetPlan: IllustrationAssetPlan[];
  futureUse: string[];
};
