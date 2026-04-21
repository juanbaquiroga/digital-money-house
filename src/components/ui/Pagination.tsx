"use client";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Determine which page numbers to display
  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 8;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      // Adjust range if near edges
      if (currentPage <= 3) {
        end = Math.min(maxVisible - 1, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxVisible + 2);
      }

      if (start > 2) pages.push(-1); // ellipsis
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push(-2); // ellipsis

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 pt-4">
      {visiblePages.map((page, idx) => {
        if (page < 0) {
          return (
            <span key={`ellipsis-${idx}`} className="text-zinc-400 px-1">
              …
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[2.25rem] h-9 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-secondary-bg text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-200 hover:text-black"
              }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
