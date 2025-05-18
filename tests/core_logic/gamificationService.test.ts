import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GamificationService } from '../../../extension/src/core_logic/gamificationService.js';

// Mocks for MindframeStore
const fakeStorage = { gamificationData: { wxp: 0, level: 1 } };
const MindframeStore = {
  get: vi.fn(() => Promise.resolve({
    gamificationData: { ...fakeStorage.gamificationData },
    activeQuestIds: [],
    completedDrillIds: [],
    settings: {},
    userProfile: null,
    userId: 'u',
    onboardingProgress: null,
    cognitiveProfileHistory: [],
    completedQuestIds: [],
    completedChallengeLog: [],
    llmAnalysisCache: {},
    lastSyncTimestamp: null,
    version: 1,
  })),
  update: vi.fn(async (fn) => {
    const current = await MindframeStore.get();
    const next = { ...current, ...fn(current) };
    fakeStorage.gamificationData = { ...next.gamificationData };
    return next;
  }),
};
vi.stubGlobal('MindframeStore', MindframeStore);

describe('GamificationService', () => {
  beforeEach(() => {
    fakeStorage.gamificationData = { wxp: 0, level: 1 };
    vi.clearAllMocks();
  });

  it('getLevel returns correct levels', () => {
    expect(GamificationService.getLevel(0)).toBe(1);
    expect(GamificationService.getLevel(100)).toBe(2);
    expect(GamificationService.getLevel(1500)).toBe(6);
    expect(GamificationService.getLevel(-5)).toBe(1);
  });

  it('getWXPForNextLevel returns correct values', () => {
    expect(GamificationService.getWXPForNextLevel(0)).toBe(100);
    expect(GamificationService.getWXPForNextLevel(100)).toBe(150);
    expect(GamificationService.getWXPForNextLevel(4500)).toBe(0);
  });

  it('addWXP increases wxp and level', async () => {
    const result = await GamificationService.addWXP(100);
    expect(result.newWxp).toBe(100);
    expect(result.newLevel).toBe(2);
    expect(result.leveledUp).toBe(true);
    const result2 = await GamificationService.addWXP(50);
    expect(result2.newWxp).toBe(150);
    expect(result2.newLevel).toBe(2); // still level 2
    expect(result2.leveledUp).toBe(false);
  });
});