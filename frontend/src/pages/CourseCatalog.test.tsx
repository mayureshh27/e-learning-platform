import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CourseCatalog } from './CourseCatalog';

// Mock the useCourses hook
vi.mock('@/hooks/useCourses', () => ({
    useCourses: vi.fn(() => ({
        data: {
            status: 'success',
            results: 2,
            data: [
                {
                    _id: '1',
                    title: 'React Fundamentals',
                    description: 'Learn React from scratch',
                    category: 'Frontend',
                    level: 'beginner',
                    price: 49.99,
                    modules: [{ _id: 'm1', title: 'Intro', lessons: [] }],
                },
                {
                    _id: '2',
                    title: 'Node.js Mastery',
                    description: 'Advanced Node.js patterns',
                    category: 'Backend',
                    level: 'advanced',
                    price: 79.99,
                    modules: [
                        { _id: 'm2', title: 'Basics', lessons: [] },
                        { _id: 'm3', title: 'Advanced', lessons: [] },
                    ],
                },
            ],
        },
        isLoading: false,
        isError: false,
    })),
}));

// Test wrapper with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
    );
}

describe('CourseCatalog Page', () => {
    it('renders the page title', () => {
        render(<CourseCatalog />, { wrapper: TestWrapper });

        expect(screen.getByText(/course catalog/i)).toBeInTheDocument();
    });

    it('displays course cards with course data', () => {
        render(<CourseCatalog />, { wrapper: TestWrapper });

        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.getByText('Node.js Mastery')).toBeInTheDocument();
    });

    it('shows course prices', () => {
        render(<CourseCatalog />, { wrapper: TestWrapper });

        expect(screen.getByText('$49.99')).toBeInTheDocument();
        expect(screen.getByText('$79.99')).toBeInTheDocument();
    });

    it('displays course levels', () => {
        render(<CourseCatalog />, { wrapper: TestWrapper });

        expect(screen.getByText('beginner')).toBeInTheDocument();
        expect(screen.getByText('advanced')).toBeInTheDocument();
    });

    it('shows module counts', () => {
        render(<CourseCatalog />, { wrapper: TestWrapper });

        expect(screen.getByText('1 Modules')).toBeInTheDocument();
        expect(screen.getByText('2 Modules')).toBeInTheDocument();
    });

    it('renders category filter buttons', () => {
        render(<CourseCatalog />, { wrapper: TestWrapper });

        expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Web Development' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Backend' })).toBeInTheDocument();
    });

    it('has search input', () => {
        render(<CourseCatalog />, { wrapper: TestWrapper });

        expect(screen.getByPlaceholderText(/search courses/i)).toBeInTheDocument();
    });

    it('renders View Details links for each course', () => {
        render(<CourseCatalog />, { wrapper: TestWrapper });

        const viewDetailsButtons = screen.getAllByText(/view details/i);
        expect(viewDetailsButtons).toHaveLength(2);
    });
});
