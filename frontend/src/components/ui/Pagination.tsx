import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalResults?: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalResults }: PaginationProps) {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-white/10 bg-zinc-950 px-6 py-4">
            {/* Results info */}
            <div className="text-sm text-zinc-500">
                {totalResults && (
                    <span>
                        Showing page <span className="font-medium text-white">{currentPage}</span> of{' '}
                        <span className="font-medium text-white">{totalPages}</span>
                        {' '}({totalResults} total results)
                    </span>
                )}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Button>

                <div className="flex gap-1">
                    {startPage > 1 && (
                        <>
                            <Button
                                variant={1 === currentPage ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(1)}
                                className="w-10"
                            >
                                1
                            </Button>
                            {startPage > 2 && (
                                <span className="flex items-center px-2 text-zinc-500">...</span>
                            )}
                        </>
                    )}

                    {pages.map((page) => (
                        <Button
                            key={page}
                            variant={page === currentPage ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(page)}
                            className="w-10"
                        >
                            {page}
                        </Button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <span className="flex items-center px-2 text-zinc-500">...</span>
                            )}
                            <Button
                                variant={totalPages === currentPage ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(totalPages)}
                                className="w-10"
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
