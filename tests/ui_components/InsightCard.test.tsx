import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import InsightCard from '../../../extension/src/ui_components/InsightCard';

// Minimal mock insight data
const mockInsight = {
  id: '1',
  title: 'Test Insight',
  sourceType: 'llm',
  hc_related: null,
  pattern_type: 'Confirmation Bias',
  explanation: 'Watch out for confirmation bias!',
  micro_challenge_prompt: 'Consider alternatives.',
};

describe('InsightCard', () => {
  it('renders with minimal props', () => {
    const accept = vi.fn();
    const dismiss = vi.fn();
    render(<InsightCard insight={mockInsight} onAccept={accept} onDismiss={dismiss} />);
    // Should display explanation and challenge prompt
    expect(screen.getByText('Watch out for confirmation bias!')).toBeInTheDocument();
    expect(screen.getByText(/Mind Gym Prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/Consider alternatives/)).toBeInTheDocument();
  });

  it('calls onDismiss when dismissed', async () => {
    const accept = vi.fn();
    const dismiss = vi.fn();
    render(<InsightCard insight={mockInsight} onAccept={accept} onDismiss={dismiss} />);
    const btn = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(btn);
    // Wait for animation duration (300ms) + margin
    await waitFor(() => expect(dismiss).toHaveBeenCalled(), { timeout: 500 });
  });

  it('calls onAccept when Accept is clicked', () => {
    const accept = vi.fn();
    const dismiss = vi.fn();
    render(<InsightCard insight={mockInsight} onAccept={accept} onDismiss={dismiss} />);
    const btn = screen.getByRole('button', { name: /accept/i });
    fireEvent.click(btn);
    expect(accept).toHaveBeenCalledWith('Consider alternatives.', null);
  });

  it('handles missing micro_challenge_prompt gracefully', () => {
    const accept = vi.fn();
    const dismiss = vi.fn();
    const noPromptInsight = { ...mockInsight, micro_challenge_prompt: undefined };
    render(<InsightCard insight={noPromptInsight} onAccept={accept} onDismiss={dismiss} />);
    // The accept button should NOT be rendered
    expect(screen.queryByRole('button', { name: /accept/i })).not.toBeInTheDocument();
  });

  it('renders error UI if an error is thrown', () => {
    // Monkey-patch the component to throw
    const Broken = () => {
      throw new Error('test error');
    };
    const accept = vi.fn();
    const dismiss = vi.fn();
    // @ts-expect-error
    render(<InsightCard insight={mockInsight} onAccept={accept} onDismiss={dismiss}><Broken /></InsightCard>);
    expect(screen.getByText(/InsightCard Error/)).toBeInTheDocument();
  });
});