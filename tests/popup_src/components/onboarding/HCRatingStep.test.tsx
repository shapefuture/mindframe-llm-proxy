import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HCRatingStep from '../../../../../extension/src/popup_src/components/onboarding/HCRatingStep';

const mockHCItems = [
  { id: 'critique', tag: '#critique', name: 'Critical Thinking', icon: '🧠', description: 'Desc 1', longDescription: '', keySkills: [], examples: [], shortTip: '' },
  { id: 'evidence', tag: '#evidence', name: 'Evidence-Based', icon: '📚', description: 'Desc 2', longDescription: '', keySkills: [], examples: [], shortTip: '' },
];

describe('HCRatingStep', () => {
  it('renders all HC items and sliders', () => {
    const onChange = vi.fn();
    render(<HCRatingStep hcItems={mockHCItems} hcProficiency={{ critique: 2, evidence: 4 }} onHCProficiencyChange={onChange} />);
    expect(screen.getByText('Critical Thinking')).toBeInTheDocument();
    expect(screen.getByText('Evidence-Based')).toBeInTheDocument();
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  it('calls onHCProficiencyChange when slider moves', () => {
    const onChange = vi.fn();
    render(<HCRatingStep hcItems={mockHCItems} hcProficiency={{}} onHCProficiencyChange={onChange} />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '3' } });
    expect(onChange).toHaveBeenCalledWith('critique', 3);
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => {
      throw new Error('test error');
    };
    const onChange = vi.fn();
    // @ts-expect-error
    render(<HCRatingStep hcItems={mockHCItems} hcProficiency={{}} onHCProficiencyChange={onChange}><Broken /></HCRatingStep>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});
