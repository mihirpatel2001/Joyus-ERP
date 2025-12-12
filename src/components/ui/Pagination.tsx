import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  className = ''
}) => {
  if (totalPages <= 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newSize);
      onPageChange(1);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row items-center justify-between gap-4 py-3 px-4 md:px-6 bg-surface rounded-b-xl flex-shrink-0 ${className}`}>
      
      {/* Mobile View: Vertical Stack to prevent clipping */}
      <div className="flex flex-col w-full gap-3 md:hidden">
        {/* Row 1: Large Navigation Buttons */}
        <div className="flex items-center justify-between bg-surface-highlight/50 p-2 rounded-lg border border-divider">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-12 h-10 p-0 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="text-sm font-semibold text-content-strong">
             Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-12 h-10 p-0 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Row 2: Rows Per Page & Record Count - Stacked horizontally */}
        {onItemsPerPageChange && (
          <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-2">
                <span className="text-xs text-content-sub font-medium">Rows:</span>
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={handlePageSizeChange}
                    className="appearance-none bg-surface border border-input text-content-strong text-xs font-medium rounded-lg pl-2 pr-6 py-1.5 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 cursor-pointer"
                  >
                    {pageSizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-content-sub pointer-events-none" />
                </div>
             </div>
             
             {totalItems && (
                <span className="text-xs text-content-sub">
                   {startItem}-{endItem} of {totalItems} records
                </span>
             )}
          </div>
        )}
      </div>

      {/* Desktop View: Standard Layout */}
      <div className="hidden md:flex flex-row items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {onItemsPerPageChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-content-sub">Rows:</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={handlePageSizeChange}
                  className="appearance-none bg-surface border border-input text-content-strong text-sm font-medium rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 cursor-pointer transition-colors hover:border-primary-500"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-sub pointer-events-none" />
              </div>
            </div>
          )}

          <div className="text-sm text-content-sub">
            {totalItems && (
              <span>
                 Showing <span className="font-semibold text-content-strong">{startItem}</span> - <span className="font-semibold text-content-strong">{endItem}</span> of <span className="font-semibold text-content-strong">{totalItems}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1 mx-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 text-content-sub text-sm">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(Number(page))}
                    className={`
                      min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                      ${currentPage === page
                        ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20 ring-1 ring-primary-600'
                        : 'text-content-normal hover:bg-surface-highlight hover:text-primary-600 border border-transparent hover:border-divider'
                      }
                    `}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};