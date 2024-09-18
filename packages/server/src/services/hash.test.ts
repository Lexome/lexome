// Write tests for the createHashes function

import { describe, it } from 'node:test';
import { createHashes } from './hash';
import { expect } from 'playwright/test';

// Test case with a long text with varied sentence structure, paragraphs, and punctuation
const longText = `
  This is a test text. It contains multiple sentences, paragraphs, and punctuation.
  The quick brown fox jumps over the lazy dog.

  This is another paragraph. It contains more sentences and punctuation.
  "Hello, how are you?" he asked, looking at the sky.
  This is an example use of a comma, to separate two words.
`;

describe('createHashes', () => {
  it('should create hashes for a given text', () => {
    const text = 'This is a test text.';
    const hashes = createHashes({ text });

    for (const hash of hashes) {
      expect(hash).toHaveProperty('startHash');
      expect(hash).toHaveProperty('endHash');
    }
  });
});
