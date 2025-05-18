import { describe, it, expect } from 'vitest';
import data from '../../../extension/src/assets/data/common_offline_insights_data';

describe('common_offline_insights_data', () => {
  it('should be an array with objects having required fields', () => {
    expect(Array.isArray(data)).toBe(true);
    for (const entry of data) {
      expect(entry).toHaveProperty('pattern_type');
      expect(entry).toHaveProperty('explanation');
      expect(entry).toHaveProperty('micro_challenge_prompt');
    }
  });
});