
import type {
  CognitiveProfileV1,
  SJTScenario,
  UserOnboardingData,
  MindframeStoreState,
  Quest
} from './types';
import { MindframeStore } from './MindframeStore.js'; // Use .js as per prompt
import { sjtScenariosData } from '../assets/data/sjt_scenarios_data';
import { starterQuestsData } from '../assets/data/starter_quests_data';
import { GamificationService } from './gamificationService.js'; // Use .js as per prompt

/**
 * Generates a UUID v4.
 * @returns {string} A new UUID.
 */
function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Calculates potential biases based on SJT answers.
 * @param sjtAnswersById - Object mapping scenarioId to selected option ID (text or index).
 * @param scenarios - Array of SJTScenario objects.
 * @returns Object map of bias names to scores.
 */
function calculatePotentialBiases(
  sjtAnswersById: { [scenarioId: string]: string },
  scenarios: SJTScenario[]
): { [biasName: string]: number } {
  const potentialBiases: { [biasName: string]: number } = {};
  try {
    console.log('[calculatePotentialBiases] Called with sjtAnswersById:', sjtAnswersById);

    scenarios.forEach(scenario => {
      const selectedOptionId = sjtAnswersById[scenario.id];
      if (selectedOptionId === undefined || selectedOptionId === null) return;

      const selectedOptionIndex = parseInt(selectedOptionId, 10);
      if (isNaN(selectedOptionIndex) || selectedOptionIndex < 0 || selectedOptionIndex >= scenario.options.length) {
        console.warn(`[calculatePotentialBiases] Invalid selectedOptionIndex for scenario ${scenario.id}:`, selectedOptionIndex);
        return;
      }

      const selectedOption = scenario.options[selectedOptionIndex];

      if (selectedOption.cognitiveBiasTargeted && (selectedOption.cognitiveBiasTargetedScore || 0) > 0) {
        const biasName = selectedOption.cognitiveBiasTargeted;
        const score = selectedOption.cognitiveBiasTargetedScore || 0;
        potentialBiases[biasName] = (potentialBiases[biasName] || 0) + score;
      }
    });

    console.log('[calculatePotentialBiases] Computed biases:', potentialBiases);
    return potentialBiases;
  } catch (error: any) {
    console.error('[calculatePotentialBiases] Error:', error);
    return {};
  }
}


/**
 * Processes user onboarding data, creates a cognitive profile,
 * initializes gamification, and assigns starter quests.
 * @param rawOnboardingData - The data collected from the onboarding UI.
 * This should match the structure expected by `UserOnboardingData` but before userId is assigned.
 */
export async function processOnboardingData(
  rawOnboardingData: Omit<UserOnboardingData, 'userId'>
): Promise<CognitiveProfileV1> {
  console.log('[processOnboardingData] Entry. RawOnboardingData:', rawOnboardingData);
  try {
    const userId = generateUUIDv4(); // Generate userId here

    const onboardingData: UserOnboardingData = {
      userId,
      ...rawOnboardingData
    };

    const potentialBiases = calculatePotentialBiases(
      onboardingData.sjtAnswersById,
      sjtScenariosData
    );

    const newProfile: CognitiveProfileV1 = {
      version: 1,
      userId: onboardingData.userId,
      primaryGoal: onboardingData.primaryGoal,
      interests: onboardingData.userInterests,
      potentialBiases,
      hcProficiency: onboardingData.hcProficiency,
      onboardingCompletedTimestamp: Date.now(),
    };

    // Determine starter quest(s)
    const activeQuestIds: string[] = [];
    const welcomeQuest = starterQuestsData.find(q => q.id === 'quest_onboarding_complete');
    if (welcomeQuest) {
      activeQuestIds.push(welcomeQuest.id);
    }

    const WXP_FOR_ONBOARDING = 50;

    await MindframeStore.update((currentState: MindframeStoreState) => {
      try {
        return {
          userId: onboardingData.userId,
          userProfile: newProfile,
          onboardingProgress: null,
          gamificationData: {
            ...currentState.gamificationData,
            wxp: (currentState.gamificationData?.wxp || 0) + WXP_FOR_ONBOARDING,
            level: GamificationService.getLevel((currentState.gamificationData?.wxp || 0) + WXP_FOR_ONBOARDING),
          },
          activeQuestIds: Array.from(new Set([...(currentState.activeQuestIds || []), ...activeQuestIds])),
        };
      } catch (err) {
        console.error('[processOnboardingData/MindframeStore.update] Error in updaterFn:', err);
        throw err;
      }
    });

    console.log('[processOnboardingData] Onboarding complete. Profile saved:', newProfile);
    const finalState = await MindframeStore.get();
    console.log(`[processOnboardingData] Gamification: WXP=${finalState.gamificationData.wxp}, Level=${finalState.gamificationData.level}`);

    return newProfile;
  } catch (error: any) {
    console.error('[processOnboardingData] Error:', error);
    throw error;
  }
}
