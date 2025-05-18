import { describe, it, expect } from 'vitest';
import { hcDrillsData } from '../../../extension/src/assets/data/hc_drills_data';
import { isHCDrillQuestion } from '../../../extension/src/core_logic/types';

describe('hcDrillsData', () => {
  it('should be an array of valid HCDrillQuestion objects', () => {
    expect(Array.isArray(hcDrillsData)).toBe(true);
    for (const entry of hcDrillsData) {
      expect(isHCDrillQuestion(entry)).toBe(true);
    }
  });

  it('should have required fields present and not empty', () => {
    for (const entry of hcDrillsData) {
      expect(entry.id).not.toBe('');
      expect(entry.name).not.toBe('');
      expect(typeof entry.questionText).toBe('string');
      expect(Array.isArray(entry.options)).toBe(true);
      expect(typeof entry.correctAnswerId).toBe('string');
    }
  });
});