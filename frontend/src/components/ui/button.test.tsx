import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button Component', () => {
    it('renders with default variant', () => {
        render(<Button>Click me</Button>);

        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    it('renders with primary variant', () => {
        render(<Button variant="primary">Primary Button</Button>);

        const button = screen.getByRole('button', { name: /primary button/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-violet-600');
    });

    it('renders with outline variant', () => {
        render(<Button variant="outline">Outline Button</Button>);

        const button = screen.getByRole('button', { name: /outline button/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-transparent');
    });

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-9');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-12');

        rerender(<Button size="icon">Icon</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-10');
    });

    it('handles click events', async () => {
        const user = userEvent.setup();
        let clicked = false;
        const handleClick = () => { clicked = true; };

        render(<Button onClick={handleClick}>Click me</Button>);

        await user.click(screen.getByRole('button'));
        expect(clicked).toBe(true);
    });

    it('is disabled when disabled prop is passed', () => {
        render(<Button disabled>Disabled Button</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });
});
