
import React from 'react';

interface GoalOption {
  id: string;
  label: string;
  description: string;
}

interface GoalSelectStepProps {
  goalOptions: GoalOption[];
  primaryGoal: string;
  onPrimaryGoalChange: (goalId: string) => void;
}

const GoalSelectStep: React.FC<GoalSelectStepProps> = ({ goalOptions, primaryGoal, onPrimaryGoalChange }) => {
  // Verbose log props on mount
  React.useEffect(() => {
    console.log('[GoalSelectStep] Mounted with props:', { goalOptions, primaryGoal });
  }, [goalOptions, primaryGoal]);

  try {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Your Primary Goal</h2>
        <p className="text-sm text-muted-foreground">What do you want to achieve with Mindframe OS?</p>
        <div className="space-y-2">
          {goalOptions.map(goal => (
            <label
              key={goal.id}
              className={`flex flex-col p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all
                ${primaryGoal === goal.id ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-secondary/30 border-border'}
              `}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="primaryGoal"
                  value={goal.id}
                  checked={primaryGoal === goal.id}
                  onChange={() => {
                    console.log('[GoalSelectStep] User selected goal:', goal.id);
                    onPrimaryGoalChange(goal.id);
                  }}
                  className="form-radio h-4 w-4 text-primary mr-2 focus:ring-primary"
                />
                <span className="font-semibold text-sm">{goal.label}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-6">{goal.description}</p>
            </label>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('[GoalSelectStep] Render error:', error);
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        <h2 className="text-lg font-bold">Error</h2>
        <p>There was a problem displaying your goal selection. Please reload or contact support.</p>
      </div>
    );
  }
};

export default GoalSelectStep;
