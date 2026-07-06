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

export class InstagramRateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InstagramRateLimitError';
  }
}

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
    if (response.status === 429) {
      throw new InstagramRateLimitError(
        `Instagram profile request failed with ${response.status} ${response.statusText}.`,
      );
    }

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

export async function runInstagramReelUpdate({
  username = process.env.INSTAGRAM_USERNAME ?? DEFAULT_USERNAME,
  fetchProfileImpl = fetchInstagramProfile,
  readFileImpl = readFile,
  targetFiles: files = targetFiles,
  updateFilesImpl = updateInstagramReelFiles,
  writeGithubOutputImpl = writeGithubOutput,
} = {}) {
  const currentSource = await readFileImpl(files[0], 'utf8');
  const currentMatch = currentSource.match(EMBED_URL_PATTERN)?.[0] ?? '';

  let profile;

  try {
    profile = await fetchProfileImpl(username);
  } catch (error) {
    if (error instanceof InstagramRateLimitError) {
      await writeGithubOutputImpl({
        blocked: 'true',
        blocker_reason: 'instagram_rate_limited',
        changed: 'false',
        latest_shortcode: '',
        new_url: '',
        old_url: currentMatch,
      });

      process.stdout.write(
        `Instagram reel lookup blocked by rate limiting; leaving homepage reel unchanged: ${currentMatch}\n`,
      );

      return {
        blocked: true,
        blockerReason: 'instagram_rate_limited',
        changed: false,
        oldUrl: currentMatch,
      };
    }

    throw error;
  }

  const latestClip = findLatestClip(profile);
  const nextEmbedUrl = buildEmbedUrl(latestClip.shortcode);

  if (currentMatch === nextEmbedUrl) {
    await writeGithubOutputImpl({
      blocked: 'false',
      changed: 'false',
      latest_shortcode: latestClip.shortcode,
      new_url: nextEmbedUrl,
      old_url: currentMatch,
    });

    return {
      blocked: false,
      changed: false,
      latestShortcode: latestClip.shortcode,
      newUrl: nextEmbedUrl,
      oldUrl: currentMatch,
      status: 'current',
    };
  }

  const results = await updateFilesImpl(nextEmbedUrl);
  const changedFiles = results
    .filter((result) => result.changed)
    .map((result) => path.relative(repoRoot, result.filePath));

  await writeGithubOutputImpl({
    blocked: 'false',
    changed: changedFiles.length > 0 ? 'true' : 'false',
    latest_shortcode: latestClip.shortcode,
    new_url: nextEmbedUrl,
    old_url: currentMatch,
  });

  return {
    blocked: false,
    changed: changedFiles.length > 0,
    changedFiles,
    latestShortcode: latestClip.shortcode,
    newUrl: nextEmbedUrl,
    oldUrl: currentMatch,
    status: 'updated',
  };
}

async function main() {
  const result = await runInstagramReelUpdate();

  if (result.blocked) {
    return;
  }

  if (!result.changed) {
    process.stdout.write(
      `Homepage Instagram reel is already current: ${result.newUrl}\n`,
    );
    return;
  }

  process.stdout.write(`Updated homepage Instagram reel from ${result.oldUrl}\n`);
  process.stdout.write(`Latest Instagram reel: ${result.newUrl}\n`);
  process.stdout.write(`Changed files: ${result.changedFiles.join(', ')}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exitCode = 1;
  });
}
