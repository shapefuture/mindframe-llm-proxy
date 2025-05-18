import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CognitiveMirrorStep from '../../../../../extension/src/popup_src/components/onboarding/CognitiveMirrorStep';

const mockProfile = {
  version: 1,
  userId: 'user-123',
  primaryGoal: 'improve_critical_thinking',
  interests: ['tech', 'science'],
  potentialBiases: { 'Confirmation Bias': 2, 'Anchoring': 0 },
  hcProficiency: { critique: 4, 'evidence-based': 3 },
  onboardingCompletedTimestamp: Date.now(),
};

describe('CognitiveMirrorStep', () => {
  it('renders loading state', () => {
    render(<CognitiveMirrorStep profile={null} isLoading={true} />);
    expect(screen.getByText(/generating your cognitive snapshot/i)).toBeInTheDocument();
  });

  it('renders error for missing profile', () => {
    render(<CognitiveMirrorStep profile={null} isLoading={false} />);
    expect(screen.getByText(/could not generate profile/i)).toBeInTheDocument();
  });

  it('renders full profile', () => {
    render(<CognitiveMirrorStep profile={mockProfile} isLoading={false} />);
    expect(screen.getByText(/Your Cognitive Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary Goal/i)).toBeInTheDocument();
    expect(screen.getByText(/Interests/i)).toBeInTheDocument();
    expect(screen.getByText(/critique: 4\/5/i)).toBeInTheDocument();
    expect(screen.getByText(/You're all set/i)).toBeInTheDocument();
  });

  it('renders bias list and omits zero-score biases', () => {
    render(<CognitiveMirrorStep profile={mockProfile} isLoading={false} />);
    expect(screen.getByText(/Confirmation Bias: Score 2/)).toBeInTheDocument();
    expect(screen.queryByText(/Anchoring: Score 0/)).not.toBeInTheDocument();
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => {
      throw new Error('test error');
    };
    // @ts-expect-error
    render(<CognitiveMirrorStep profile={mockProfile} isLoading={false}><Broken /></CognitiveMirrorStep>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});