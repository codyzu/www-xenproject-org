import process from 'node:process';
import {fetchAllGhostPosts, writeGhostCacheAtomic} from './ghost.ts';

const apiUrl = process.env.GHOST_CONTENT_API_URL?.trim();
const apiKey = process.env.GHOST_CONTENT_API_KEY?.trim();
if (!apiUrl || !apiKey) {
  console.error('Search refresh requires GHOST_CONTENT_API_URL and GHOST_CONTENT_API_KEY.');
  process.exitCode = 1;
} else {
  try {
    console.log('Connecting to the Ghost Content API…');
    const posts = await fetchAllGhostPosts({
      apiUrl,
      apiKey,
      onProgress({page, pages, pagePostCount, totalPostCount}) {
        console.log(`Fetched Ghost page ${page}/${pages}: ${pagePostCount} posts (${totalPostCount} total).`);
      },
    });
    console.log(`Validated ${posts.length} published Ghost posts; updating the local cache…`);
    await writeGhostCacheAtomic(posts);
    console.log(`Refreshed the local Ghost search cache with ${posts.length} published posts.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Ghost search refresh failed.');
    process.exitCode = 1;
  }
}
