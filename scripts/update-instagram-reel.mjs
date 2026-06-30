#!/usr/bin/env node

import { appendFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_USERNAME = 'doublegoodmusic';
const INSTAGRAM_PROFILE_URL =
  'https://www.instagram.com/api/v1/users/web_profile_info/';
const EMBED_URL_PATTERN =
  /https:\/\/www\.instagram\.com\/reel\/[A-Za-z0-9_-]+\/embed\//g;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const targetFiles = [
  path.join(repoRoot, 'src/lib/site-content.ts'),
  path.join(repoRoot, 'tests/smoke.spec.ts'),
];

export function buildEmbedUrl(shortcode) {
  if (!shortcode || typeof shortcode !== 'string') {
    throw new Error('Instagram reel shortcode is required.');
  }

  return `https://www.instagram.com/reel/${shortcode}/embed/`;
}

export function findLatestClip(profile) {
  const user = profile?.data?.user;
  const timelineEdges = [
    ...(user?.edge_owner_to_timeline_media?.edges ?? []),
    ...(user?.edge_felix_video_timeline?.edges ?? []),
  ];

  const clips = timelineEdges
    .map((edge) => edge?.node)
    .filter((node) => node?.product_type === 'clips')
    .filter(
      (node) =>
        typeof node.shortcode === 'string' &&
        typeof node.taken_at_timestamp === 'number',
    )
    .map((node) => ({
      shortcode: node.shortcode,
      takenAt: node.taken_at_timestamp,
    }))
    .sort((a, b) => b.takenAt - a.takenAt);

  if (clips.length === 0) {
    throw new Error('No Instagram reel clips found in profile response.');
  }

  return clips[0];
}

export function replaceInstagramEmbedUrl(source, nextEmbedUrl) {
  EMBED_URL_PATTERN.lastIndex = 0;
  if (!EMBED_URL_PATTERN.test(source)) {
    throw new Error('No Instagram reel embed URL found to replace.');
  }

  EMBED_URL_PATTERN.lastIndex = 0;
  return source.replace(EMBED_URL_PATTERN, nextEmbedUrl);
}

export async function fetchInstagramProfile(username = DEFAULT_USERNAME) {
  const url = new URL(INSTAGRAM_PROFILE_URL);
  url.searchParams.set('username', username);

  const response = await fetch(url, {
    headers: {
      Referer: `https://www.instagram.com/${username}/reels/`,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      'X-ASBD-ID': '129477',
      'X-IG-App-ID': '936619743392459',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Instagram profile request failed with ${response.status} ${response.statusText}.`,
    );
  }

  return response.json();
}

export async function updateInstagramReelFiles(nextEmbedUrl) {
  const results = [];

  for (const filePath of targetFiles) {
    const source = await readFile(filePath, 'utf8');
    const nextSource = replaceInstagramEmbedUrl(source, nextEmbedUrl);
    const changed = source !== nextSource;

    if (changed) {
      await writeFile(filePath, nextSource);
    }

    results.push({
      changed,
      filePath,
    });
  }

  return results;
}

async function writeGithubOutput(values) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`);
  await appendFile(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`);
}

async function main() {
  const username = process.env.INSTAGRAM_USERNAME ?? DEFAULT_USERNAME;
  const profile = await fetchInstagramProfile(username);
  const latestClip = findLatestClip(profile);
  const nextEmbedUrl = buildEmbedUrl(latestClip.shortcode);
  const currentSource = await readFile(targetFiles[0], 'utf8');
  const currentMatch = currentSource.match(EMBED_URL_PATTERN)?.[0] ?? '';

  if (currentMatch === nextEmbedUrl) {
    await writeGithubOutput({
      changed: 'false',
      latest_shortcode: latestClip.shortcode,
      new_url: nextEmbedUrl,
      old_url: currentMatch,
    });
    process.stdout.write(
      `Homepage Instagram reel is already current: ${nextEmbedUrl}\n`,
    );
    return;
  }

  const results = await updateInstagramReelFiles(nextEmbedUrl);
  const changedFiles = results
    .filter((result) => result.changed)
    .map((result) => path.relative(repoRoot, result.filePath));

  await writeGithubOutput({
    changed: changedFiles.length > 0 ? 'true' : 'false',
    latest_shortcode: latestClip.shortcode,
    new_url: nextEmbedUrl,
    old_url: currentMatch,
  });

  process.stdout.write(
    `Updated homepage Instagram reel from ${currentMatch}\n`,
  );
  process.stdout.write(`Latest Instagram reel: ${nextEmbedUrl}\n`);
  process.stdout.write(`Changed files: ${changedFiles.join(', ')}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exitCode = 1;
  });
}
