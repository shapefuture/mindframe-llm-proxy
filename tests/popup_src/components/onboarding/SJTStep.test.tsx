import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SJTStep from '../../../../../extension/src/popup_src/components/onboarding/SJTStep';

const mockScenarios = [
  {
    id: 'sjt1',
    scenarioText: 'You get feedback you disagree with...',
    biasExplanation: 'Watch for bias!',
    relatedInterests: [],
    options: [
      { text: 'Ignore the feedback', cognitiveBiasTargeted: null, isBetterThinking: false },
      { text: 'Reflect and seek evidence', cognitiveBiasTargeted: 'Confirmation Bias', cognitiveBiasTargetedScore: 2, isBetterThinking: true },
    ],
  },
];

describe('SJTStep', () => {
  it('renders scenarios and options', () => {
    const onChange = vi.fn();
    render(<SJTStep sjtScenarios={mockScenarios} sjtAnswersById={{}} onSJTAnswerChange={onChange} />);
    expect(screen.getByText(/You get feedback you disagree with/)).toBeInTheDocument();
    expect(screen.getByText(/Ignore the feedback/)).toBeInTheDocument();
    expect(screen.getByText(/Reflect and seek evidence/)).toBeInTheDocument();
    expect(screen.getByText(/Watch for bias!/)).toBeInTheDocument();
  });

  it('calls onSJTAnswerChange when option is selected', () => {
    const onChange = vi.fn();
    render(<SJTStep sjtScenarios={mockScenarios} sjtAnswersById={{}} onSJTAnswerChange={onChange} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(onChange).toHaveBeenCalledWith('sjt1', 1);
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => { throw new Error('test error'); };
    const onChange = vi.fn();
    // @ts-expect-error
    render(<SJTStep sjtScenarios={mockScenarios} sjtAnswersById={{}} onSJTAnswerChange={onChange}><Broken /></SJTStep>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});