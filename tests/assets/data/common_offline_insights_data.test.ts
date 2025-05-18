import { describe, it, expect } from 'vitest';
import { commonOfflineInsightsData } from '../../../extension/src/assets/data/common_offline_insights_data';

describe('commonOfflineInsightsData', () => {
  it('should be an array of objects with required fields', () => {
    expect(Array.isArray(commonOfflineInsightsData)).toBe(true);
    for (const entry of commonOfflineInsightsData) {
      expect(typeof entry.id).toBe('string');
      expect(typeof entry.pattern_type).toBe('string');
      expect(typeof entry.explanation).toBe('string');
      expect(typeof entry.micro_challenge_prompt).toBe('string');
    }
  });

  it('should not have any missing or empty required fields', () => {
    for (const entry of commonOfflineInsightsData) {
      expect(entry.id).not.toBe('');
      expect(entry.pattern_type).not.toBe('');
      expect(entry.explanation).not.toBe('');
      expect(entry.micro_challenge_prompt).not.toBe('');
    }
  });

  it('should not contain invalid data types', () => {
    for (const entry of commonOfflineInsightsData) {
      expect(['string', 'object']).toContain(typeof entry.hcId);
    }
  });
});