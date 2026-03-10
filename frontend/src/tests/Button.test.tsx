import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant class by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('btn-primary');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('btn-secondary');
    
    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText('Danger')).toHaveClass('bg-danger');
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button isLoading>Test</Button>);
    expect(screen.getByText('Test')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});