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

  // Compiler
  let compiler;
  for (let i = 0; i < tokens.length; i++) {
    if (knownCompilers.has(tokens[i])) {
      compiler = tokens[i];
      tokens.splice(i, 1);
      break;
    }
  }

  return {...expandJobFields(arch, platform), platform, name, compiler, variant: tokens};
}

function expandJobFields(
  arch: string,
  platform: string,
): {friendlyPlatform: string; arch: string; icons: string[]; location?: {name: string; lat: number; lng: number}} {
  let friendlyPlatform = platform;
  const icons = [];
  let location;

  // Friendly platform names
  if (friendlyPlatform === 'adl') {
    friendlyPlatform = 'Intel Alder Lake (i5-12600K)';
    icons.push('i-lineicons-intel', 'i-mdi-cpu-64-bit');
    location = {name: 'Berlin', lat: 52.52, lng: 13.405};
  }

  if (friendlyPlatform === 'kbl') {
    friendlyPlatform = 'Intel Kaby Lake (i7-7567U)';
    icons.push('i-lineicons-intel', 'i-mdi-cpu-64-bit');
    location = {name: 'Berlin', lat: 52.52, lng: 13.405};
  }

  if (friendlyPlatform === 'zen2') {
    friendlyPlatform = 'AMD Zen 2';
    icons.push('i-lineicons-amd', 'i-mdi-cpu-64-bit');
    location = {name: 'Boston', lat: 42.3601, lng: -71.0589};
  }

  if (friendlyPlatform === 'zen3p') {
    friendlyPlatform = 'AMD Zen 3+';
    icons.push('i-lineicons-amd', 'i-mdi-cpu-64-bit');
    location = {name: 'Boston', lat: 42.3601, lng: -71.0589};
  }

  if (friendlyPlatform === 'zen4') {
    friendlyPlatform = 'AMD Zen 4';
    icons.push('i-lineicons-amd', 'i-mdi-cpu-64-bit');
    location = {name: 'Boston', lat: 42.3601, lng: -71.0589};
  }

  if (friendlyPlatform === 'xilinx') {
    if (arch === 'arm64') {
      friendlyPlatform = 'Xilinx Ultrascale+ MPSoC (ARM64)';
      icons.push('i-file-icons-arm', 'i-mdi-cpu-64-bit');
    } else {
      friendlyPlatform = 'AMD Ryzen Embedded v2000';
      icons.push('i-lineicons-amd', 'i-mdi-cpu-64-bit');
    }

    location = {name: 'San Jose', lat: 37.3382, lng: -121.8863};
  }

  const friendlyArch = arch === 'x86_64' ? 'x86-64' : arch;

  return {friendlyPlatform, arch: friendlyArch, icons, location};
}
