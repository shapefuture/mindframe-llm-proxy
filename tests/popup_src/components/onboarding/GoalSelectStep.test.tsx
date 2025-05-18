import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GoalSelectStep from '../../../../extension/src/popup_src/components/onboarding/GoalSelectStep';

describe('GoalSelectStep', () => {
  const goalOptions = [
    { id: '1', label: 'A', description: 'desc A' },
    { id: '2', label: 'B', description: 'desc B' }
  ];
  const primaryGoal = '1';
  const onPrimaryGoalChange = vi.fn();

  it('renders options and handles selection', () => {
    render(
      <GoalSelectStep
        goalOptions={goalOptions}
        primaryGoal={primaryGoal}
        onPrimaryGoalChange={onPrimaryGoalChange}
      />
    );
    expect(screen.getByText('Your Primary Goal')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('B'));
    expect(onPrimaryGoalChange).toHaveBeenCalledWith('2');
  });
});