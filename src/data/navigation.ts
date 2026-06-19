import {readFileSync} from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import {z} from 'zod';

export type NavigationItem = {
  name: string;
  href: string;
  target?: '_blank';
  header?: boolean;
  footer?: boolean;
  children?: NavigationItem[];
};

const navigationItemSchema: z.ZodType<NavigationItem> = z.lazy(() =>
  z.object({
    name: z.string(),
    href: z.string(),
    target: z.literal('_blank').optional(),
    header: z.boolean().optional(),
    footer: z.boolean().optional(),
    children: z.array(navigationItemSchema).optional(),
  }),
);

const navigationYaml = readFileSync(path.resolve('data/navigation.yaml'), 'utf8');

export const navigationItems = z.array(navigationItemSchema).parse(yaml.load(navigationYaml));
