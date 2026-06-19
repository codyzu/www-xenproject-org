import {readFileSync} from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import {z} from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  route: z.string().regex(/^\/projects\/.+\/$/),
  order: z.number().int().nonnegative(),
});

export type Project = z.infer<typeof projectSchema>;

const projectsYaml = readFileSync(path.resolve('data/projects.yaml'), 'utf8');

export const projects = z
  .array(projectSchema)
  .parse(yaml.load(projectsYaml))
  .toSorted((a, b) => a.order - b.order);
