import assert from 'node:assert/strict';
import test from 'node:test';
import {generateDownloads} from '../../src/loaders/downloads.js';
import MirageOSProvider from '../../scripts/downloads/provider-mirageos.js';
import XenProvider from '../../scripts/downloads/provider-xen.js';
import XcpNgProvider, {newestInstaller, selectXcpNgArtifacts} from '../../scripts/downloads/provider-xcpng.js';

const directory = (links) =>
  `<html><body><pre>${links.map((link) => `<a href="${link}">${link}</a>`).join('\n')}</pre></body></html>`;

const xcp83Files = [
  'old/',
  'SHA256SUMS',
  'SHA256SUMS.asc',
  'xcp-ng-8.3.0-20250606-netinstall.iso',
  'xcp-ng-8.3.0-20250606.2.iso',
  'xcp-ng-8.3.0-20250606.iso',
];

test('selects the newest refreshed XCP-ng installer and verification set', () => {
  assert.equal(newestInstaller(xcp83Files), 'xcp-ng-8.3.0-20250606.2.iso');
  assert.deepEqual(selectXcpNgArtifacts(directory(xcp83Files)), [
    'xcp-ng-8.3.0-20250606.2.iso',
    'xcp-ng-8.3.0-20250606-netinstall.iso',
    'SHA256SUMS',
    'SHA256SUMS.asc',
  ]);
});

test('discovers the newest stable XCP-ng directory and ignores prerelease-only releases', async () => {
  const pages = new Map([
    ['https://updates.xcp-ng.org/isos/', directory(['old/', 'drivers/', '8.3/', '9.0/'])],
    [
      'https://updates.xcp-ng.org/isos/9.0/',
      directory(['SHA256SUMS', 'SHA256SUMS.asc', 'xcp-ng-9.0.0-rc1.iso', 'xcp-ng-9.0.0-rc1-netinstall.iso']),
    ],
    ['https://updates.xcp-ng.org/isos/8.3/', directory(xcp83Files)],
  ]);
  const provider = new XcpNgProvider({fetchPage: async (url) => pages.get(url)});

  assert.deepEqual(await provider.getVersions(), [
    {
      name: '8.3',
      link: 'https://mirrors.xcp-ng.org/isos/8.3/?https=1',
    },
  ]);
  assert.deepEqual(await provider.getFilesAndFolders('8.3'), [
    {
      name: 'xcp-ng-8.3.0-20250606.2.iso',
      url: 'https://mirrors.xcp-ng.org/isos/8.3/xcp-ng-8.3.0-20250606.2.iso?https=1',
    },
    {
      name: 'xcp-ng-8.3.0-20250606-netinstall.iso',
      url: 'https://mirrors.xcp-ng.org/isos/8.3/xcp-ng-8.3.0-20250606-netinstall.iso?https=1',
    },
    {
      name: 'SHA256SUMS',
      url: 'https://mirrors.xcp-ng.org/isos/8.3/SHA256SUMS?https=1',
    },
    {
      name: 'SHA256SUMS.asc',
      url: 'https://mirrors.xcp-ng.org/isos/8.3/SHA256SUMS.asc?https=1',
    },
  ]);
});

test('only hydrates files for providers that publish required artifacts', async () => {
  const releaseProvider = {
    name: 'Release provider',
    key: 'release',
    async getVersions() {
      return [{name: '1.0', link: 'https://example.com/release'}];
    },
    async getFilesAndFolders() {
      throw new Error('should not be called');
    },
  };
  const [group] = await generateDownloads([releaseProvider]);
  assert.deepEqual(group.versions[0].files, []);
});

test('provider failures reject the build-time refresh', async () => {
  const provider = {
    name: 'XCP-ng',
    key: 'xcpng',
    async getVersions() {
      throw new Error('offline');
    },
  };

  await assert.rejects(generateDownloads([provider]), /offline/);
});

test('providers can opt into hydrating required release artifacts', async () => {
  const provider = {
    name: 'XCP-ng',
    key: 'xcpng',
    includeFiles: true,
    async getVersions() {
      return [{name: '8.3', link: 'https://example.com/8.3'}];
    },
    async getFilesAndFolders() {
      return [{name: 'refreshed.iso', url: 'https://example.com/refreshed.iso'}];
    },
  };
  const [group] = await generateDownloads([provider]);
  assert.equal(group.versions.length, 1);
  assert.equal(group.versions[0].files[0].name, 'refreshed.iso');
});

test('Xen provider keeps stable and release-candidate parsing behavior', async () => {
  const provider = new XenProvider({
    fetchPage: async () => directory(['../', '4.21.1/', '4.22.0-rc2/', 'latest/', 'README']),
  });
  assert.deepEqual(await provider.getVersions(), [
    {name: '4.21.1', link: 'https://downloads.xenproject.org/release/xen/4.21.1/'},
    {name: '4.22.0-rc2', link: 'https://downloads.xenproject.org/release/xen/4.22.0-rc2/'},
  ]);
});

test('Mirage OS provider requests complete paginated release history', async () => {
  const requested = [];
  const releases = Array.from({length: 100}, (_, index) => ({
    tag_name: `v4.${index}.0`,
    html_url: `https://example.com/v4.${index}.0`,
  }));
  const provider = new MirageOSProvider({
    fetchData: async (url) => {
      requested.push(url);
      return requested.length === 1
        ? releases
        : [{tag_name: 'v3.0.0', html_url: 'https://example.com/v3.0.0'}];
    },
  });

  const versions = await provider.getVersions();
  assert.equal(versions.length, 101);
  assert.match(requested[0], /[?&]per_page=100/);
  assert.match(requested[1], /[?&]page=2/);
});
