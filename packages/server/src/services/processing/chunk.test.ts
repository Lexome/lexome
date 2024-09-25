// Write tests for the chunk service

import { describe, it } from 'node:test';
import { expect } from 'playwright/test';
import { readChaptersFromEpub } from './chunk';

describe('readChaptersFromEpub', () => {
  it('should read chapters from an epub file', async () => {
    const chapters = await readChaptersFromEpub('https://www.gutenberg.org/cache/epub/11/pg11.epub');
    expect(chapters).toHaveLength(1);
  });

})