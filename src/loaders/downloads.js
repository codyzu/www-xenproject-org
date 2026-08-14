import process from 'node:process';
import MirageOSProvider from '../../scripts/downloads/provider-mirageos.js';
import XcpNgProvider from '../../scripts/downloads/provider-xcpng.js';
import XenProvider from '../../scripts/downloads/provider-xen.js';

export const providers = [new XenProvider(), new XcpNgProvider(), new MirageOSProvider()];

export async function generateDownloads(registeredProviders = providers) {
  return Promise.all(
    registeredProviders.map(async (provider) => {
      const versions = await provider.getVersions();

      if (!Array.isArray(versions) || versions.length === 0) {
        throw new Error(`${provider.name} did not return any download versions.`);
      }

      const hydratedVersions = await Promise.all(
        versions.map(async (version) => ({
          ...version,
          files: provider.includeFiles ? await provider.getFilesAndFolders(version.name) : [],
        })),
      );

      return {name: provider.name, key: provider.key, versions: hydratedVersions};
    }),
  );
}

const fixtureDownloads = async () => {
  const {downloadsFixture} = await import('../../tests/fixtures/downloads.js');
  return downloadsFixture;
};

export function downloadsLoader({source = process.env.DOWNLOADS_SOURCE ?? 'live'} = {}) {
  return {
    name: 'xen-downloads-loader',
    async load({logger, parseData, store}) {
      if (!['fixture', 'live'].includes(source)) {
        throw new Error(`Unknown DOWNLOADS_SOURCE value: ${source}`);
      }

      logger.info(source === 'live' ? 'Fetching live download data' : 'Loading the download test fixture');
      const groups = source === 'live' ? await generateDownloads() : await fixtureDownloads();
      const entries = await Promise.all(
        groups.map(async (group) => ({
          id: group.key,
          data: await parseData({id: group.key, data: group}),
        })),
      );

      store.clear();
      for (const entry of entries) {
        store.set(entry);
      }
    },
  };
}
