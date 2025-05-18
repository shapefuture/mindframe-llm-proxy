import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingView from '../../../../../extension/src/popup_src/views/OnboardingView';

// Mock router and step components
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
}));
vi.mock('@components/onboarding/WelcomeStep', () => ({
  __esModule: true,
  default: ({ onInterestsChange, selectedInterests, interestOptions }: any) => (
    <div>
      WelcomeStep
      {interestOptions.map((i: any) => (
        <label key={i.id}>{i.label}</label>
      ))}
    </div>
  ),
}));
vi.mock('@components/onboarding/SJTStep', () => ({
  __esModule: true,
  default: () => <div>SJTStep</div>,
}));
vi.mock('@components/onboarding/HCRatingStep', () => ({
  __esModule: true,
  default: () => <div>HCRatingStep</div>,
}));
vi.mock('@components/onboarding/GoalSelectStep', () => ({
  __esModule: true,
  default: () => <div>GoalSelectStep</div>,
}));
vi.mock('@components/onboarding/CognitiveMirrorStep', () => ({
  __esModule: true,
  default: () => <div>CognitiveMirrorStep</div>,
}));
vi.mock('@core_logic/onboardingLogic', () => ({
  processOnboardingData: vi.fn(() => Promise.resolve({ version: 1, userId: 'u', primaryGoal: '', interests: [], potentialBiases: {}, hcProficiency: {}, onboardingCompletedTimestamp: Date.now() })),
}));
vi.mock('@assets/data/sjt_scenarios_data', () => ({ sjtScenariosData: [] }));
vi.mock('@assets/data/hc_library_data', () => ({ hcLibraryData: [] }));

describe('OnboardingView', () => {
  it('renders WelcomeStep and interest options', () => {
    render(<OnboardingView />);
    expect(screen.getByText(/WelcomeStep/)).toBeInTheDocument();
    expect(screen.getByText(/Technology/)).toBeInTheDocument();
    expect(screen.getByText(/Science/)).toBeInTheDocument();
    expect(screen.getByText(/Business & Finance/)).toBeInTheDocument();
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => { throw new Error('test error'); };
    // @ts-expect-error
    render(<OnboardingView><Broken /></OnboardingView>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});