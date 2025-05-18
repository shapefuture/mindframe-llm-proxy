
/**
 * @file Manages gamification logic like WXP and levels.
 */
// JSDoc type imports
/** @typedef {import('./types').MindframeStoreState} MindframeStoreState */
/** @typedef {import('./MindframeStore').MindframeStore} MindframeStore */ // Assuming MindframeStore is imported if needed directly, but we'll use its static methods.

// Assuming MindframeStore.js is in the same directory and MindframeStore is the class name
import { MindframeStore } from './MindframeStore.js';

export class GamificationService {
  /**
   * WXP thresholds for each level. Index corresponds to WXP needed to reach that level.
   * Level 1: 0 WXP
   * Level 2: 100 WXP
   * ...
   * @type {number[]}
   * @static
   * @readonly
   */
  static WXP_THRESHOLDS = [0, 100, 250, 500, 1000, 1500, 2100, 2800, 3600, 4500]; // WXP for L1, L2, ... L10

  /**
   * Calculates the user's level based on their WXP.
   * Levels are 1-indexed.
   * @param {number} wxp - The user's current WXP.
   * @returns {number} The calculated level.
   * @static
   */
  static getLevel(wxp) {
    try {
      console.log(`[GamificationService.getLevel] Called with wxp: ${wxp}`);
      for (let i = this.WXP_THRESHOLDS.length - 1; i >= 0; i--) {
        if (wxp >= this.WXP_THRESHOLDS[i]) {
          console.log(`[GamificationService.getLevel] Level determined: ${i + 1}`);
          return i + 1;
        }
      }
      console.warn(`[GamificationService.getLevel] wxp below all thresholds. Returning level 1.`);
      return 1;
    } catch (error) {
      console.error('[GamificationService.getLevel] Error:', error);
      return 1;
    }
  }

  /**
   * Adds WXP to the user's current total and updates their level accordingly.
   * @param {number} points - The amount of WXP to add.
   * @returns {Promise<{newWxp: number, newLevel: number, leveledUp: boolean}>}
   * A promise that resolves with the new WXP, new level, and a boolean indicating if the user leveled up.
   * @static
   */
  static async addWXP(points) {
    console.log(`[GamificationService.addWXP] Called with points: ${points}`);
    try {
      const currentState = await MindframeStore.get();
      const oldLevel = currentState.gamificationData.level;

      const newWxp = currentState.gamificationData.wxp + points;
      const newLevel = GamificationService.getLevel(newWxp);
      const leveledUp = newLevel > oldLevel;

      await MindframeStore.update((state) => {
        try {
          return {
            ...state,
            gamificationData: {
              ...state.gamificationData,
              wxp: newWxp,
              level: newLevel,
            },
          };
        } catch (err) {
          console.error('[GamificationService.addWXP] Error in update partial:', err);
          throw err;
        }
      });

      if (leveledUp) {
        console.log(`[GamificationService.addWXP] Leveled up from ${oldLevel} to ${newLevel}!`);
      } else {
        console.log(`[GamificationService.addWXP] No level up. NewWXP: ${newWxp}, Level: ${newLevel}`);
      }

      return { newWxp, newLevel, leveledUp };
    } catch (error) {
      console.error('[GamificationService.addWXP] Error:', error);
      throw error;
    }
  }

  /**
   * Gets the WXP needed to reach the next level.
   * @param {number} currentWxp - The user's current WXP.
   * @returns {number} WXP points needed for the next level, or 0 if at max level.
   * @static
   */
  static getWXPForNextLevel(currentWxp) {
    try {
      console.log(`[GamificationService.getWXPForNextLevel] Called with currentWxp: ${currentWxp}`);
      const currentLevel = GamificationService.getLevel(currentWxp);
      if (currentLevel >= GamificationService.WXP_THRESHOLDS.length) {
        console.log(`[GamificationService.getWXPForNextLevel] Max level reached.`);
        return 0;
      }
      const wxpForNextLevelAbsolute = GamificationService.WXP_THRESHOLDS[currentLevel];
      const needed = wxpForNextLevelAbsolute - currentWxp;
      console.log(`[GamificationService.getWXPForNextLevel] WXP needed for next level: ${needed}`);
      return needed;
    } catch (error) {
      console.error('[GamificationService.getWXPForNextLevel] Error:', error);
      return 0;
    }
  }
}
