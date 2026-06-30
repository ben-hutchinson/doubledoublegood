import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  buildEmbedUrl,
  findLatestClip,
  replaceInstagramEmbedUrl,
} from './update-instagram-reel.mjs';

describe('update-instagram-reel helpers', () => {
  test('findLatestClip chooses the newest reel clip from public profile data', () => {
    const profile = {
      data: {
        user: {
          edge_owner_to_timeline_media: {
            edges: [
              {
                node: {
                  shortcode: 'olderClip',
                  product_type: 'clips',
                  taken_at_timestamp: 100,
                },
              },
              {
                node: {
                  shortcode: 'newestClip',
                  product_type: 'clips',
                  taken_at_timestamp: 300,
                },
              },
            ],
          },
          edge_felix_video_timeline: {
            edges: [
              {
                node: {
                  shortcode: 'oldIgtv',
                  product_type: 'igtv',
                  taken_at_timestamp: 1000,
                },
              },
            ],
          },
        },
      },
    };

    assert.deepEqual(findLatestClip(profile), {
      shortcode: 'newestClip',
      takenAt: 300,
    });
  });

  test('buildEmbedUrl converts a shortcode into the app embed URL format', () => {
    assert.equal(
      buildEmbedUrl('DaFJbpLMhGl'),
      'https://www.instagram.com/reel/DaFJbpLMhGl/embed/',
    );
  });

  test('replaceInstagramEmbedUrl updates the configured reel URL', () => {
    const source = `
      instagramReelEmbedUrl: getTrustedExternalUrl(
        'https://www.instagram.com/reel/DZhHOf4IwdH/embed/',
      ),
    `;

    assert.equal(
      replaceInstagramEmbedUrl(
        source,
        'https://www.instagram.com/reel/DaFJbpLMhGl/embed/',
      ),
      `
      instagramReelEmbedUrl: getTrustedExternalUrl(
        'https://www.instagram.com/reel/DaFJbpLMhGl/embed/',
      ),
    `,
    );
  });
});
