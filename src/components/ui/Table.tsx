import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string; // Applied to td
  headerClassName?: string; // Applied to th
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: string; // default 'id'
  onRowClick?: (item: T) => void;
  emptyMessage?: React.ReactNode;
  className?: string;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  onRowClick,
  emptyMessage = 'No data available.',
  className = ''
}: TableProps<T>) => {
  return (
    <table className={`w-full text-sm text-left whitespace-nowrap ${className}`}>
      <thead className="bg-canvas text-content-sub font-medium border-b border-divider sticky top-0 z-10 shadow-sm">
        <tr>
          {columns.map((col, index) => (
            <th 
              key={index} 
              className={`px-6 py-4 bg-canvas ${col.headerClassName || ''}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-divider">
        {data.length > 0 ? (
          data.map((item) => (
            <tr 
              key={item[keyField]} 
              className={`transition-colors ${onRowClick ? 'hover:bg-surface-highlight cursor-pointer' : 'hover:bg-surface-highlight'}`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col, index) => (
                <td key={index} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.render 
                    ? col.render(item) 
                    : (col.accessorKey ? item[col.accessorKey] : null)
                  }
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="px-6 py-8 text-center text-content-sub">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};