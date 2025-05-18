import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DrillView from '../../../../../extension/src/popup_src/views/DrillView';

// Mock react-router-dom hooks and data
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useParams: () => ({ hcId: 'critique', drillId: 'critique_drill1' }),
  useNavigate: () => vi.fn(),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

// Mock data and store
vi.mock('@assets/data/hc_drills_data', () => ({
  hcDrillsData: [
    {
      id: 'critique_drill1',
      hcId: 'critique',
      name: 'Drill 1',
      questionText: 'What is critical thinking?',
      options: [
        { id: 'a', text: 'Guessing' },
        { id: 'b', text: 'Evaluating evidence' },
      ],
      correctAnswerId: 'b',
      explanationOnCorrect: 'Good job!',
      explanationOnIncorrect: 'Try again.',
      rewardWXP: 10,
    },
  ]
}));
vi.mock('@assets/data/hc_library_data', () => ({
  hcLibraryData: [
    { id: 'critique', tag: '#critique', name: 'Critical Thinking', icon: '🧠', description: '', longDescription: '', keySkills: [], examples: [], shortTip: '' }
  ]
}));
vi.mock('@core_logic/MindframeStore.js', () => ({
  MindframeStore: {
    get: () => Promise.resolve({ completedDrillIds: [] }),
    update: () => Promise.resolve(),
  }
}));
vi.mock('@core_logic/gamificationService.js', () => ({
  GamificationService: { addWXP: () => Promise.resolve() }
}));

describe('DrillView', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders drill question and options', () => {
    render(<DrillView />);
    expect(screen.getByText('Drill 1')).toBeInTheDocument();
    expect(screen.getByText('What is critical thinking?')).toBeInTheDocument();
    expect(screen.getByText('Guessing')).toBeInTheDocument();
    expect(screen.getByText('Evaluating evidence')).toBeInTheDocument();
  });

  it('submits an answer and shows feedback', async () => {
    render(<DrillView />);
    // Select the correct answer
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    const submitBtn = screen.getByRole('button', { name: /submit answer/i });
    fireEvent.click(submitBtn);
    // Feedback should appear
    expect(await screen.findByText(/Good job!/i)).toBeInTheDocument();
    expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
  });

  it('renders error UI if an error is thrown', () => {
    // Patch the component to throw
    const Broken = () => { throw new Error('test error'); };
    // @ts-expect-error
    render(<DrillView><Broken /></DrillView>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });
});