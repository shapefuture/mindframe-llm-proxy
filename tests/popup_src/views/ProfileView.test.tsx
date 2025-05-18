import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileView from '../../../../../extension/src/popup_src/views/ProfileView';

// Mock router and store/data
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));
vi.mock('@core_logic/MindframeStore.js', () => ({
  MindframeStore: {
    get: vi.fn(() => Promise.resolve({
      userProfile: {
        userId: 'u',
        version: 1,
        primaryGoal: 'improve',
        interests: ['science'],
        potentialBiases: {},
        hcProficiency: {},
        onboardingCompletedTimestamp: Date.now(),
      },
      gamificationData: { wxp: 100, level: 2 },
      activeQuestIds: [],
      completedChallengeLog: [],
    }))
  }
}));
vi.mock('@core_logic/gamificationService.js', () => ({
  GamificationService: {
    WXP_THRESHOLDS: [0, 100, 250],
    getWXPForNextLevel: () => 150,
  }
}));
vi.mock('@assets/data/starter_quests_data', () => ({
  starterQuestsData: []
}));
vi.mock('@assets/data/hc_library_data', () => ({
  hcLibraryData: [
    { id: 'critique', tag: '#critique', name: 'Critical Thinking', icon: '🧠', description: '', longDescription: '', keySkills: [], examples: [], shortTip: '' }
  ]
}));

describe('ProfileView', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders loading state', () => {
    render(<ProfileView />);
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('renders error UI when MindframeStore.get throws', async () => {
    vi.mocked(require('@core_logic/MindframeStore.js').MindframeStore.get).mockImplementationOnce(() => Promise.reject(new Error('fail')));
    render(<ProfileView />);
    expect(await screen.findByText(/an error occurred while loading your profile/i)).toBeInTheDocument();
  });

  it('renders no profile UI if userProfile is missing', async () => {
    vi.mocked(require('@core_logic/MindframeStore.js').MindframeStore.get).mockImplementationOnce(() => Promise.resolve({}));
    render(<ProfileView />);
    expect(await screen.findByText(/profile not found or onboarding not completed/i)).toBeInTheDocument();
  });

  it('renders main profile info when user data present', async () => {
    render(<ProfileView />);
    expect(await screen.findByText(/Your Mindframe Profile/)).toBeInTheDocument();
    expect(screen.getByText(/Level 2/)).toBeInTheDocument();
    expect(screen.getByText(/Goal:/)).toBeInTheDocument();
    expect(screen.getByText(/Interests:/)).toBeInTheDocument();
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => { throw new Error('test error'); };
    // @ts-expect-error
    render(<ProfileView><Broken /></ProfileView>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});