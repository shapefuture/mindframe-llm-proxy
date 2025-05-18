import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HcDetailView from '../../../../../extension/src/popup_src/views/HcDetailView';

// Mock react-router-dom and data
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useParams: () => ({ hcId: 'critique' }),
  useNavigate: () => vi.fn(),
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));
vi.mock('@assets/data/hc_library_data', () => ({
  hcLibraryData: [
    { id: 'critique', tag: '#critique', name: 'Critical Thinking', icon: '🧠', description: 'Skill desc', longDescription: '', keySkills: [], examples: ['Example 1'], shortTip: '' }
  ]
}));
vi.mock('@assets/data/hc_drills_data', () => ({
  hcDrillsData: [
    { id: 'critique_drill1', hcId: 'critique', name: 'Drill 1', questionText: '', options: [], correctAnswerId: '', explanationOnCorrect: '', explanationOnIncorrect: '', rewardWXP: 10 }
  ]
}));

describe('HcDetailView', () => {
  it('renders HC skill and drills', () => {
    render(<HcDetailView />);
    expect(screen.getByText('Critical Thinking')).toBeInTheDocument();
    expect(screen.getByText('Skill desc')).toBeInTheDocument();
    expect(screen.getByText('Drill 1')).toBeInTheDocument();
    expect(screen.getByText(/Examples/)).toBeInTheDocument();
    expect(screen.getByText('Example 1')).toBeInTheDocument();
  });

  it('shows missing skill message if not found', () => {
    vi.mocked(require('react-router-dom').useParams).mockReturnValue({ hcId: 'missing' });
    render(<HcDetailView />);
    expect(screen.getByText(/could not find the requested cognitive skill/i)).toBeInTheDocument();
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => { throw new Error('test error'); };
    // @ts-expect-error
    render(<HcDetailView><Broken /></HcDetailView>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});