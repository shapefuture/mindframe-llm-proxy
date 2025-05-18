import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import HCRatingStep from '../../../../../extension/src/popup_src/components/onboarding/HCRatingStep';

const mockHCs = [
  {
    id: 'critique',
    tag: '#critique',
    name: 'Critical Thinking',
    icon: '🧠',
    description: 'Think carefully.',
    longDescription: 'Long desc',
    keySkills: ['Analysis'],
    examples: ['Example 1'],
    shortTip: 'Think twice.',
  },
  {
    id: 'evidence',
    tag: '#evidence',
    name: 'Evidence-Based',
    icon: '📊',
    description: 'Use evidence.',
    longDescription: 'L',
    keySkills: ['Gather'],
    examples: [],
    shortTip: 'Check facts.',
  }
];

describe('HCRatingStep', () => {
  it('renders HC items and their proficiency values', () => {
    const onChange = vi.fn();
    render(<HCRatingStep hcItems={mockHCs} hcProficiency={{ critique: 3, evidence: 1 }} onHCProficiencyChange={onChange} />);
    expect(screen.getByText(/Critical Thinking/)).toBeInTheDocument();
    expect(screen.getByText(/Evidence-Based/)).toBeInTheDocument();
    expect(screen.getAllByRole('slider')).toHaveLength(2);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls onHCProficiencyChange when slider is moved', () => {
    const onChange = vi.fn();
    render(<HCRatingStep hcItems={mockHCs} hcProficiency={{}} onHCProficiencyChange={onChange} />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '4' } });
    expect(onChange).toHaveBeenCalledWith('critique', 4);
  });

  it('renders error UI if an error is thrown', () => {
    const Broken = () => { throw new Error('test-err'); };
    const onChange = vi.fn();
    // @ts-expect-error
    render(<HCRatingStep hcItems={mockHCs} hcProficiency={{}} onHCProficiencyChange={onChange}><Broken /></HCRatingStep>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});