import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const errors = [];

const requiredFiles = [
  'src/components/legacy/README.md',
  'src/components/primitives/README.md',
  'src/components/blocks/README.md',
  'src/components/pages/README.md',
  'src/layouts/BaseLayout.astro',
  'src/layouts/LegacyLayout.astro',
  'src/styles/legacy.scss',
  'src/styles/foundation/tokens.css',
  'src/styles/foundation/base.css',
  'src/pages/internal/design-system.astro',
  'docs/redesign-foundation.md',
];

const walk = (directory) => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
};

const read = filePath => fs.readFileSync(path.join(root, filePath), 'utf8');
const relative = filePath => path.relative(root, filePath);

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    errors.push(`${file}: missing required redesign foundation file`);
  }
}

const sourceFiles = [
  ...walk(path.join(root, 'src')),
  path.join(root, 'uno.config.ts'),
  path.join(root, 'astro.config.mjs'),
  path.join(root, 'scripts/astro/check-public-artifact.js'),
].filter(file => fs.existsSync(file) && /\.(?:astro|css|scss|md|mjs|ts|js|tsx|mdx)$/.test(file));

for (const filePath of sourceFiles) {
  const file = relative(filePath);
  const contents = fs.readFileSync(filePath, 'utf8');

  if (contents.includes('styles/theme/main.scss') && file !== 'src/styles/legacy.scss') {
    errors.push(`${file}: legacy Sass theme may only be imported by src/styles/legacy.scss`);
  }

  if (contents.includes('styles/legacy.scss') && file !== 'src/layouts/LegacyLayout.astro') {
    errors.push(`${file}: src/styles/legacy.scss may only be imported by LegacyLayout.astro`);
  }
}

if (fs.existsSync(path.join(root, 'src/layouts/BaseLayout.astro'))) {
  const baseLayout = read('src/layouts/BaseLayout.astro');
  for (const forbidden of ['components/legacy/', 'styles/legacy.scss', 'styles/theme/', 'scripts/menu.js', 'scripts/animate.js']) {
    if (baseLayout.includes(forbidden)) {
      errors.push(`src/layouts/BaseLayout.astro: clean layout must not include ${forbidden}`);
    }
  }

  if (!baseLayout.includes("import 'uno.css'") || !baseLayout.includes('styles/foundation/base.css')) {
    errors.push('src/layouts/BaseLayout.astro: clean layout must import uno.css and foundation base CSS');
  }
}

if (fs.existsSync(path.join(root, 'src/layouts/LegacyLayout.astro'))) {
  const legacyLayout = read('src/layouts/LegacyLayout.astro');
  if (!legacyLayout.includes("import 'uno.css'") || !legacyLayout.includes('styles/legacy.scss')) {
    errors.push('src/layouts/LegacyLayout.astro: legacy layout must import uno.css and legacy.scss');
  }
}

const rootAstroComponents = fs.existsSync(path.join(root, 'src/components'))
  ? fs.readdirSync(path.join(root, 'src/components'), {withFileTypes: true})
    .filter(entry => entry.isFile() && entry.name.endsWith('.astro'))
    .map(entry => entry.name)
  : [];

for (const component of rootAstroComponents) {
  errors.push(`src/components/${component}: migrated or new Astro components must live under legacy/, primitives/, blocks/, or pages/`);
}

const publicPageFiles = walk(path.join(root, 'src/pages')).filter(file => /\.(?:astro|mdx)$/.test(file));
for (const filePath of publicPageFiles) {
  const file = relative(filePath);
  const contents = fs.readFileSync(filePath, 'utf8');
  const isInternalDesignSystem = file === 'src/pages/internal/design-system.astro';
  const isApprovedPublicRedesign = [
    'src/pages/index.astro',
    'src/pages/community/index.astro',
    'src/pages/technology/architecture.astro',
    'src/pages/technology/index.astro',
    'src/pages/technology/isolation-and-security.astro',
    'src/pages/technology/safety.astro',
    'src/pages/projects/embedded-and-automotive.astro',
    'src/pages/resources/use-cases.astro',
  ].includes(file);

  if (!isInternalDesignSystem && !isApprovedPublicRedesign && contents.includes('BaseLayout')) {
    errors.push(`${file}: existing public pages must use LegacyLayout or ContentLayout, not BaseLayout`);
  }
}

if (fs.existsSync(path.join(root, 'src/pages/internal/design-system.astro'))) {
  const playground = read('src/pages/internal/design-system.astro');
  if (!playground.includes('BaseLayout')) {
    errors.push('src/pages/internal/design-system.astro: playground must use BaseLayout');
  }

  if (!playground.includes('noindex, nofollow')) {
    errors.push('src/pages/internal/design-system.astro: playground must set noindex, nofollow');
  }
}

if (fs.existsSync(path.join(root, 'data/navigation.yaml'))) {
  const navigation = read('data/navigation.yaml');
  if (navigation.includes('/internal/design-system')) {
    errors.push('data/navigation.yaml: internal design system page must not be promoted in navigation');
  }
}

if (fs.existsSync(path.join(root, 'uno.config.ts'))) {
  const unoConfig = read('uno.config.ts');
  if (!unoConfig.includes("presetWind3({prefix: 'uno-'})")) {
    errors.push('uno.config.ts: UnoCSS must preserve the uno- prefix');
  }

  for (const token of ['xp:', "'xp-content'", "'xp-page'", "'xp-wide'"]) {
    if (!unoConfig.includes(token)) {
      errors.push(`uno.config.ts: missing token-backed UnoCSS theme entry ${token}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
