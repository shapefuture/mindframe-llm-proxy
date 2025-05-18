import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MindframeStore } from '../../extension/src/core_logic/MindframeStore.js';

const fakeStorage = {};
const chrome = {
  storage: {
    local: {
      get: vi.fn((keys, cb) => {
        if (typeof keys === 'string') keys = [keys];
        const out = {};
        for (const key of keys) out[key] = fakeStorage[key];
        cb(out);
      }),
      set: vi.fn((obj, cb) => {
        Object.assign(fakeStorage, obj);
        if (cb) cb();
      }),
      remove: vi.fn((key, cb) => {
        delete fakeStorage[key];
        if (cb) cb();
      }),
    },
  },
};
(globalThis as any).chrome = chrome;

describe('MindframeStore', () => {
  beforeEach(() => {
    for (const k in fakeStorage) delete fakeStorage[k];
    vi.clearAllMocks();
  });

  it('returns default state if none exists', async () => {
    const state = await MindframeStore.get();
    expect(state).toHaveProperty('userId');
    expect(state).toHaveProperty('version', MindframeStore.CURRENT_VERSION);
    expect(state).toHaveProperty('settings');
  });

  it('stores and retrieves state', async () => {
    const firstState = await MindframeStore.get();
    await MindframeStore.update((cur) => ({ ...cur, userProfile: { id: 'u', primaryGoal: 'g' } }));
    const updated = await MindframeStore.get();
    expect(updated.userProfile).toEqual({ id: 'u', primaryGoal: 'g' });
  });

  it('clears storage', async () => {
    await MindframeStore.get();
    await MindframeStore.clear();
    expect(fakeStorage[MindframeStore.STORAGE_KEY]).toBeUndefined();
  });
});