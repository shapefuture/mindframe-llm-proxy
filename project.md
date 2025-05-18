# Mindframe OS Project Overview

## What is this project?

Mindframe OS is a browser extension and application designed to help users develop better cognitive skills, reduce biases, and sharpen their thinking as they browse the web. It operates by analyzing visible text content on web pages, offering personalized cognitive insights, micro-challenges, and gamified learning—empowering users to reflect, learn, and grow in real time.

Key features include:
- **Continuous Context Monitoring:** The extension analyzes the visible content a user is reading and surfaces relevant "insights" or challenges based on cognitive skill patterns.
- **Onboarding and Profiling:** New users complete an onboarding flow (interest selection, SJT questions, skill self-ratings, goals), which is used to generate a personalized cognitive profile.
- **Gamification:** Users earn experience points (WXP), levels, and complete quests and challenges as they interact with the system.
- **Heuristics/Cognitive Skill Library:** A structured catalog of cognitive skills (heuristics), each with their own drills and learning resources.
- **Robust Error Handling, Logging, and Testing:** The codebase is hardened for production with strict linting, thorough tests, and verbose logging for maximum reliability and developer experience.

---

## Main Codebase Structure and Functionality

### 1. **Core Logic (`extension/src/core_logic/`)**

- **types.ts:**  
  Contains all TypeScript interfaces/types for core data (e.g., user profile, cognitive skills, drills, quests, insights) and runtime type guard functions for data validation.

- **MindframeStore.js:**  
  Asynchronous wrapper around `chrome.storage.local` providing persistent state management (user profile, onboarding, gamification, history, etc.).  
  Main methods:
    - `getDefaultState()`: Returns a default-initialized state object.
    - `get()`: Loads and validates state from storage; resets if version mismatch.
    - `update(updaterFn)`: Applies a partial update and persists state.
    - `clear()`: Removes all extension data from storage.

- **gamificationService.js:**  
  Handles XP/level logic and gamification events:
    - `getLevel(wxp)`: Returns user level from XP.
    - `addWXP(points)`: Adds XP and updates level in store.
    - `getWXPForNextLevel(currentWxp)`: Returns XP needed for next level.

- **onboardingLogic.ts:**  
  Functions to process onboarding responses into a cognitive profile:
    - `calculatePotentialBiases(sjtAnswersById, sjtScenarios)`: Analyzes SJT answers for bias patterns.
    - `processOnboardingData(userOnboardingData)`: Generates a `CognitiveProfileV1`, updates gamification, and assigns starter quests.

---

### 2. **Data Assets (`extension/src/assets/data/`)**

- **hc_library_data.ts:**  
  Array of all cognitive/heuristic skills (id, name, icon, description, etc.).

- **hc_drills_data.ts:**  
  Array of multiple-choice drills for each cognitive skill (question, options, correct answer, feedback).

- **common_offline_insights_data.ts:**  
  Pre-generated insight "tips" for offline use.

- **sjt_scenarios_data.ts:**  
  Situational judgment test scenarios for onboarding.

- **starter_quests_data.ts:**  
  Quests for users to complete as part of the gamification system.

---

### 3. **UI Components**

- **extension/src/ui_components/InsightCard.tsx:**  
  Renders an insight/tip card, handles user responses (accept/dismiss challenge), and displays micro-challenge prompts.

- **extension/src/popup_src/components/onboarding/**  
  Onboarding step components:
    - `WelcomeStep`: Lets user select interests.
    - `SJTStep`: Presents situational judgment scenarios.
    - `HCRatingStep`: Lets user rate their cognitive skill familiarity.
    - `GoalSelectStep`: Lets user pick a primary goal.
    - `CognitiveMirrorStep`: Shows the generated cognitive profile summary.

---

### 4. **Popup Views (`extension/src/popup_src/views/`)**

- **OnboardingView.tsx:**  
  Main onboarding flow controller, manages state and step navigation, renders onboarding step components.

- **ProfileView.tsx:**  
  Displays user profile (level, XP, quests, biases, interests, recent challenges, etc.).

- **GymView.tsx:**  
  Shows the library of cognitive skills for further exploration and practice.

- **HcDetailView.tsx:**  
  Details for a single cognitive skill, including examples and available drills.

- **DrillView.tsx:**  
  Presents an individual drill/question for a skill, handles answer submission and feedback.

---

### 5. **Content Script (`extension/src/content_scripts/content_script.tsx`)**

- **ContinuousContextMonitor:**  
  Watches web pages for content changes, extracts visible text, and requests insights from the service worker.

- **InsightCard Rendering:**  
  Injects the InsightCard UI into the page and handles user interactions.

- **Highlighting:**  
  Highlights relevant page elements based on insight suggestions.

---

### 6. **Service Worker (`extension/src/service_worker/service_worker.ts`)**

- Handles communication between the extension popup, content scripts, and backend LLM proxy.
- Receives requests for text analysis, fetches insights from the backend or returns offline tips, and manages storage/caching.

---

### 7. **Testing and Infrastructure**

- **Vitest** and **React Testing Library** are used for unit and component tests across core logic, data, and UI.
- **ESLint** and **Prettier** enforce code style, import order, and formatting.
- **CI Workflow** runs lint, format, and tests on every push and PR.
- **Type Guards** and **Runtime Data Validation**: All important data loaded from storage or network is validated at runtime for shape and type.

---

## Function-by-Function Highlights (Sample)

- **MindframeStore.get():**  
  Loads extension state from storage, validates version, resets to defaults if needed, and logs state.

- **GamificationService.addWXP(points):**  
  Adds XP, checks for level-up, updates store, and logs changes.

- **processOnboardingData(userOnboardingData):**  
  Transforms onboarding answers into a cognitive profile, awards XP, assigns starter quests, and updates storage.

- **InsightCard:**  
  React component that displays an insight/tip, handles user actions, and triggers highlighting or challenge acceptance.

- **ContinuousContextMonitor.analyzeVisibleContent:**  
  Extracts, deduplicates, and sends visible text to the service worker for analysis, logs all steps.

- **Service Worker (handleAnalyzeText):**  
  Receives text from content script, checks cache, calls backend LLM proxy, parses insights, updates store/cache, and sends results to the content script.

---

## Summary

Mindframe OS is a robust, extensible, and production-ready browser extension for cognitive skill development, featuring:
- Real-time context analysis and LLM-powered insights.
- Gamified learning with quests, XP, and leveling.
- Strict error catching, verbose logging, linting, formatting, and comprehensive tests.
- Modular code and clear separation of concerns.

For more details, see each module’s source code and the in-file documentation/type signatures.