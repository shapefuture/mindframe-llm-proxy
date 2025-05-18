import { describe, it, expect } from 'vitest';
import {
  isHCData,
  isCognitiveProfileV1,
  isMindframeStoreState,
  HCData,
  CognitiveProfileV1,
  MindframeStoreState,
} from '../../../extension/src/core_logic/types';

// Minimal valid objects
const validHCData: HCData = {
  id: 'critique',
  tag: '#critique',
  name: 'Critical Thinking',
  icon: '🧠',
  description: 'Concise desc',
  longDescription: 'Long desc',
  keySkills: ['Analysis'],
  examples: ['Example 1'],
  shortTip: 'Think twice.',
};

const validProfile: CognitiveProfileV1 = {
  version: 1,
  userId: 'user-1',
  primaryGoal: 'improve_critical_thinking',
  interests: ['tech'],
  potentialBiases: { 'Confirmation Bias': 2 },
  hcProficiency: { critique: 3 },
  onboardingCompletedTimestamp: Date.now(),
};

const validStore: MindframeStoreState = {
  version: 1,
  userId: 'user-1',
  userProfile: validProfile,
  onboardingProgress: null,
  settings: { analysisEnabled: true, showInsightCard: true, theme: 'system' },
  cognitiveProfileHistory: [validProfile],
  gamificationData: { wxp: 0, level: 1 },
  activeQuestIds: [],
  completedQuestIds: [],
  completedDrillIds: [],
  completedChallengeLog: [],
  llmAnalysisCache: {},
  lastSyncTimestamp: null,
};

describe('type guards (core_logic/types.ts)', () => {
  it('isHCData returns true for valid HCData', () => {
    expect(isHCData(validHCData)).toBe(true);
  });
  it('isHCData returns false for invalid HCData', () => {
    expect(isHCData({})).toBe(false);
    expect(isHCData({ id: 1 })).toBe(false);
  });

  it('isCognitiveProfileV1 returns true for valid CognitiveProfileV1', () => {
    expect(isCognitiveProfileV1(validProfile)).toBe(true);
  });
  it('isCognitiveProfileV1 returns false for invalid CognitiveProfileV1', () => {
    expect(isCognitiveProfileV1({})).toBe(false);
    expect(isCognitiveProfileV1({ userId: 123 })).toBe(false);
  });

  it('isMindframeStoreState returns true for valid store', () => {
    expect(isMindframeStoreState(validStore)).toBe(true);
  });
  it('isMindframeStoreState returns false for invalid store', () => {
    expect(isMindframeStoreState({})).toBe(false);
    expect(isMindframeStoreState({ userId: 1 })).toBe(false);
  });
});