import {cp, rm} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const astroOutputDirectory = path.join(projectRoot, 'dist-astro');
const publicDirectory = path.join(projectRoot, 'public');

const migratedRoutes = [
  '/about/contact-us/',
  '/contribute/code-of-conduct/',
  '/contribute/contribution-guidelines/',
  '/resources/matrix/',
];

const generatedAssetDirectories = [
  '_astro',
];

const stripSlashes = (value) => value.replace(/^\/+|\/+$/g, '');

const copyDirectory = async ({from, to, label}) => {
  await rm(to, {force: true, recursive: true});
  await cp(from, to, {recursive: true});
  console.log(`Overlayed ${label}: ${path.relative(projectRoot, from)} -> ${path.relative(projectRoot, to)}`);
};

for (const directory of generatedAssetDirectories) {
  await copyDirectory({
    from: path.join(astroOutputDirectory, directory),
    to: path.join(publicDirectory, directory),
    label: `Astro asset directory /${directory}/`,
  });
}

for (const route of migratedRoutes) {
  const routePath = stripSlashes(route);

  await copyDirectory({
    from: path.join(astroOutputDirectory, routePath),
    to: path.join(publicDirectory, routePath),
    label: `migrated route ${route}`,
  });
}
