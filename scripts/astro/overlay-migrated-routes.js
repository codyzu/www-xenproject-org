import {copyFile, cp, mkdir, rm} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {overlayRoutes} from './migrated-routes.ts';

const projectRoot = process.cwd();
const astroOutputDirectory = path.join(projectRoot, 'dist-astro');
const publicDirectory = path.join(projectRoot, 'public');

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

for (const route of overlayRoutes) {
  const routePath = stripSlashes(route);
  const sourceFile = path.join(astroOutputDirectory, routePath, 'index.html');
  const destinationDirectory = path.join(publicDirectory, routePath);
  const destinationFile = path.join(destinationDirectory, 'index.html');

  await mkdir(destinationDirectory, {recursive: true});
  await copyFile(sourceFile, destinationFile);
  console.log(`Overlayed migrated route ${route}: ${path.relative(projectRoot, sourceFile)} -> ${path.relative(projectRoot, destinationFile)}`);
}
