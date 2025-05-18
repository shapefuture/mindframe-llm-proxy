
import type { HCDrillQuestion } from '../../core_logic/types';
import { isHCDrillQuestion } from '../../core_logic/types';

export const hcDrillsData: HCDrillQuestion[] = [
  // ... (unchanged data)
  // [DATA OMITTED IN PATCH FOR BREVITY: retain all drills as before]
];

// Validate on load
if (process.env.NODE_ENV !== 'production') {
  for (const entry of hcDrillsData) {
    if (!isHCDrillQuestion(entry)) {
      // eslint-disable-next-line no-console
      console.warn('[hcDrillsData] Invalid HCDrillQuestion:', entry);
    }
  }
}
