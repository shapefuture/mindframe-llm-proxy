import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WelcomeStep from '../../../../../extension/src/popup_src/components/onboarding/WelcomeStep';

const mockInterestOptions = [
  { id: 'tech', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'history', label: 'History' },
];

describe('WelcomeStep', () => {
  it('renders all interest options and selected states', () => {
    const onChange = vi.fn();
    render(<WelcomeStep onInterestsChange={onChange} selectedInterests={['science']} interestOptions={mockInterestOptions} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('calls onInterestsChange when a checkbox is toggled', () => {
    const onChange = vi.fn();
    render(<WelcomeStep onInterestsChange={onChange} selectedInterests={[]} interestOptions={mockInterestOptions} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[2]);
    expect(onChange).toHaveBeenCalledWith('history', true);
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => { throw new Error('test error'); };
    const onChange = vi.fn();
    // @ts-expect-error
    render(<WelcomeStep onInterestsChange={onChange} selectedInterests={[]} interestOptions={mockInterestOptions}><Broken /></WelcomeStep>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});