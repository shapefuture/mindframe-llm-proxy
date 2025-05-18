import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as onboardingLogic from '../../../extension/src/core_logic/onboardingLogic.ts';

// Test for calculatePotentialBiases
describe('calculatePotentialBiases', () => {
  const sjtScenarios = [
    {
      id: 's1',
      scenarioText: 'Scenario 1',
      biasExplanation: '',
      relatedInterests: [],
      options: [
        { text: 'A', cognitiveBiasTargeted: 'Confirmation Bias', cognitiveBiasTargetedScore: 2, isBetterThinking: false },
        { text: 'B', cognitiveBiasTargeted: null, isBetterThinking: true },
      ],
    },
    {
      id: 's2',
      scenarioText: 'Scenario 2',
      biasExplanation: '',
      relatedInterests: [],
      options: [
        { text: 'C', cognitiveBiasTargeted: 'Anchoring', cognitiveBiasTargetedScore: 1, isBetterThinking: false },
        { text: 'D', cognitiveBiasTargeted: null, isBetterThinking: true },
      ],
    },
  ];

  it('computes bias scores correctly', () => {
    const sjtAnswersById = { s1: "0", s2: "0" }; // Select first option (biased) for both
    const result = onboardingLogic['calculatePotentialBiases'](sjtAnswersById, sjtScenarios);
    expect(result).toEqual({ "Confirmation Bias": 2, "Anchoring": 1 });
  });

  it('returns empty object if no biases present', () => {
    const sjtAnswersById = { s1: "1", s2: "1" }; // Select neutral options
    const result = onboardingLogic['calculatePotentialBiases'](sjtAnswersById, sjtScenarios);
    expect(result).toEqual({});
  });

  it('handles invalid selectedOptionIndex', () => {
    const sjtAnswersById = { s1: "5", s2: "notanumber" };
    const result = onboardingLogic['calculatePotentialBiases'](sjtAnswersById, sjtScenarios);
    expect(result).toEqual({});
  });
});

// Test for processOnboardingData (mocking MindframeStore and GamificationService)
describe('processOnboardingData', () => {
  const fakeProfile = {
    version: 1,
    userId: 'user-1',
    primaryGoal: 'goal',
    interests: ['a'],
    potentialBiases: {},
    hcProficiency: { h1: 2 },
    onboardingCompletedTimestamp: Date.now(),
  };
  beforeEach(() => {
    vi.stubGlobal('MindframeStore', {
      update: vi.fn(() => Promise.resolve()),
      get: vi.fn(() => Promise.resolve({
        gamificationData: { wxp: 0, level: 1 },
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
    });
    vi.stubGlobal('GamificationService', {
      getLevel: vi.fn(() => 1),
    });
    vi.stubGlobal('starterQuestsData', []);
    vi.stubGlobal('sjtScenariosData', []);
  });

  it('returns a CognitiveProfileV1', async () => {
    const payload = {
      userInterests: ['a'],
      sjtAnswersById: {},
      hcProficiency: { h1: 2 },
      primaryGoal: 'goal',
    };
    const result = await onboardingLogic.processOnboardingData(payload);
    expect(result).toHaveProperty('version', 1);
    expect(result).toHaveProperty('primaryGoal', 'goal');
    expect(Array.isArray(result.interests)).toBe(true);
  });
});