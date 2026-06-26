import {readFileSync} from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import {z} from 'zod';

export type NavigationV2Link = {
  name: string;
  href: string;
  target?: '_blank';
  header?: boolean;
  footer?: boolean;
};

export type NavigationV2Group = {
  name: string;
  links: NavigationV2Link[];
};

export type NavigationV2Cta = NavigationV2Link;

export type NavigationV2Item = NavigationV2Link & {
  description?: string;
  groups?: NavigationV2Group[];
  cta?: NavigationV2Cta | true;
};

const navigationV2LinkSchema = z.object({
  name: z.string(),
  href: z.string(),
  target: z.literal('_blank').optional(),
  header: z.boolean().optional(),
  footer: z.boolean().optional(),
});

const navigationV2GroupSchema = z.object({
  name: z.string(),
  links: z.array(navigationV2LinkSchema),
});

const navigationV2ItemSchema: z.ZodType<NavigationV2Item> = navigationV2LinkSchema.extend({
  description: z.string().optional(),
  groups: z.array(navigationV2GroupSchema).optional(),
  cta: z.union([navigationV2LinkSchema, z.literal(true)]).optional(),
});

const navigationV2Yaml = readFileSync(path.resolve('data/navigation-v2.yaml'), 'utf8');

export const navigationV2Items = z.array(navigationV2ItemSchema).parse(yaml.load(navigationV2Yaml));
export const navigationV2Sections = navigationV2Items.filter((item) => item.cta !== true);
export const navigationV2Ctas = navigationV2Items.filter((item) => item.cta === true);
