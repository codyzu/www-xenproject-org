import {type ParsedJobTokens} from './schema.ts';

export function parseJobName(name: string): ParsedJobTokens | undefined {
  // Normalize the name by replacing x86-64 with x86_64
  const normalizedName = name.replaceAll('x86-64', 'x86_64');
  const parts = normalizedName.split('-');
  const platform = parts[0];
  const tokens = parts.slice(1);
  const knownCompilers = new Set(['gcc', 'clang']);
  const archPrefixes = ['x86', 'arm', 'ppc', 'riscv'];
  const archPattern = new RegExp(`^(${archPrefixes.join('|')})[\\w-]*$`);

  // Detect architecture
  let arch;
  for (let i = 0; i < tokens.length; i++) {
    if (archPattern.test(tokens[i])) {
      arch = tokens[i];
      tokens.splice(i, 1);
      break;
    }
  }

  // If arch is missing, warn and skip
  if (!arch || !platform) {
    return undefined;
  }

  const result: ParsedJobTokens = {
    platform,
    arch,
    friendlyPlatform: platform,
    icons: [],
    name,
  };

  // Compiler
  for (let i = 0; i < tokens.length; i++) {
    if (knownCompilers.has(tokens[i])) {
      result.compiler = tokens[i];
      tokens.splice(i, 1);
      break;
    }
  }

  // Remaining tokens = variant
  if (tokens.length > 0) {
    result.variant = tokens;
  }

  return expandJobFields(result);
}

function expandJobFields(job: ParsedJobTokens) {
  let {arch} = job;
  let friendlyPlatform = job.platform;
  const icons = [];

  // Friendly platform names
  if (friendlyPlatform === 'adl') {
    friendlyPlatform = 'Intel Alder Lake (i5-12600K)';
    icons.push('i-lineicons-intel', 'i-mdi-cpu-64-bit');
  }

  if (friendlyPlatform === 'kbl') {
    friendlyPlatform = 'Intel Kaby Lake (i7-7567U)';
    icons.push('i-lineicons-intel', 'i-mdi-cpu-64-bit');
  }

  if (friendlyPlatform === 'zen2') {
    friendlyPlatform = 'AMD Zen 2';
    icons.push('i-lineicons-amd', 'i-mdi-cpu-64-bit');
  }

  if (friendlyPlatform === 'zen3p') {
    friendlyPlatform = 'AMD Zen 3+';
    icons.push('i-lineicons-amd', 'i-mdi-cpu-64-bit');
  }

  if (friendlyPlatform === 'zen4') {
    friendlyPlatform = 'AMD Zen 4';
    icons.push('i-lineicons-amd', 'i-mdi-cpu-64-bit');
  }

  if (friendlyPlatform === 'xilinx') {
    if (arch === 'arm64') {
      friendlyPlatform = 'Xilinx Ultrascale+ MPSoC (ARM64)';
      icons.push('i-file-icons-arm', 'i-mdi-cpu-64-bit');
    } else {
      friendlyPlatform = 'AMD Ryzen Embedded v2000';
      icons.push('i-lineicons-amd', 'i-mdi-cpu-64-bit');
    }
  }

  // Friendly architecture names
  if (arch === 'x86_64') {
    arch = 'x86-64';
  }

  return {...job, friendlyPlatform, arch, icons};
}
