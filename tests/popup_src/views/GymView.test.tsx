import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GymView from '../../../../../extension/src/popup_src/views/GymView';

// Mock react-router-dom and data
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  Link: ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));
vi.mock('@assets/data/hc_library_data', () => ({
  hcLibraryData: [
    { id: 'critique', tag: '#critique', name: 'Critical Thinking', icon: '🧠', description: 'Desc A', longDescription: '', keySkills: [], examples: [], shortTip: '' },
    { id: 'evidence', tag: '#evidence', name: 'Evidence-Based', icon: '📚', description: 'Desc B', longDescription: '', keySkills: [], examples: [], shortTip: '' },
  ]
}));

describe('GymView', () => {
  it('renders all HC skills as links', () => {
    render(<GymView />);
    expect(screen.getByText('Critical Thinking')).toBeInTheDocument();
    expect(screen.getByText('Evidence-Based')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(3); // 2 skills + 1 profile link
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => { throw new Error('test error'); };
    // @ts-expect-error
    render(<GymView><Broken /></GymView>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});