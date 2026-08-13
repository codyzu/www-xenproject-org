#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const excludedDirectories = new Set(['.git', '.cache', 'dist', 'node_modules', 'playwright-report', 'screenshots']);
const markdownExtensions = new Set(['.md', '.mdx']);
const errors = [];

const walk = directory => fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
  if (excludedDirectories.has(entry.name)) {
    return [];
  }

  const absolutePath = path.join(directory, entry.name);
  if (entry.isDirectory()) {
    return walk(absolutePath);
  }

  return markdownExtensions.has(path.extname(entry.name)) ? [absolutePath] : [];
});

const withoutCodeFences = source => source.replaceAll(/^\s*(```|~~~)[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '');
const localTarget = rawTarget => {
  const target = rawTarget.trim().replace(/^<|>$/g, '');
  if (!target || target.startsWith('#') || target.startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(target)) {
    return undefined;
  }

  return decodeURIComponent(target.split('#', 1)[0].split('?', 1)[0]);
};

for (const file of walk(root)) {
  const relativeFile = path.relative(root, file);
  const source = withoutCodeFences(fs.readFileSync(file, 'utf8'));
  const targets = [
    ...[...source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]),
    ...[...source.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match => match[1]),
  ];

  for (const rawTarget of targets) {
    const target = localTarget(rawTarget);
    if (!target) {
      continue;
    }

    const resolved = path.resolve(path.dirname(file), target);
    if (!resolved.startsWith(`${root}${path.sep}`) && resolved !== root) {
      errors.push(`${relativeFile}: link escapes the repository: ${rawTarget}`);
    } else if (!fs.existsSync(resolved)) {
      errors.push(`${relativeFile}: missing local target: ${rawTarget}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Documentation links are valid.');
}
