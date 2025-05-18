import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import GoalSelectStep from '../../../../../extension/src/popup_src/components/onboarding/GoalSelectStep';

describe('GoalSelectStep', () => {
  const mockGoals = [
    { id: 'a', label: 'Goal A', description: 'Desc A' },
    { id: 'b', label: 'Goal B', description: 'Desc B' },
  ];

  it('renders goals and selection', () => {
    const onChange = vi.fn();
    render(<GoalSelectStep goalOptions={mockGoals} primaryGoal={'a'} onPrimaryGoalChange={onChange} />);
    expect(screen.getByText('Goal A')).toBeInTheDocument();
    expect(screen.getByText('Goal B')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /goal a/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /goal b/i })).not.toBeChecked();
  });

  it('calls onPrimaryGoalChange when a goal is selected', () => {
    const onChange = vi.fn();
    render(<GoalSelectStep goalOptions={mockGoals} primaryGoal={''} onPrimaryGoalChange={onChange} />);
    const bRadio = screen.getByRole('radio', { name: /goal b/i });
    fireEvent.click(bRadio);
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => {
      throw new Error('test error');
    };
    const onChange = vi.fn();
    // @ts-expect-error
    render(<GoalSelectStep goalOptions={mockGoals} primaryGoal={'a'} onPrimaryGoalChange={onChange}><Broken /></GoalSelectStep>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});

  it('calls onPrimaryGoalChange when a goal is selected', () => {
    const onPrimaryGoalChange = vi.fn();
    render(<GoalSelectStep goalOptions={goalOptions} primaryGoal="" onPrimaryGoalChange={onPrimaryGoalChange} />);
    const radio = screen.getByDisplayValue('reduce_biases');
    fireEvent.click(radio);
    expect(onPrimaryGoalChange).toHaveBeenCalledWith('reduce_biases');
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const BrokenOption = () => {
      throw new Error('render err');
    };
    const onPrimaryGoalChange = vi.fn();
    // @ts-expect-error
    render(<GoalSelectStep goalOptions={goalOptions}><BrokenOption /></GoalSelectStep>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});
