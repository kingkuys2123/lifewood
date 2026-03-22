import { useEffect, useRef, useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
import './AdminDataTable.css';

const MotionDiv = motion.div;

export default function AdminDataTable({
  title,
  table,
  globalFilter,
  onGlobalFilterChange,
  createButtonLabel,
  pageSize,
  onPageSizeChange,
}) {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const columnsMenuRef = useRef(null);
  const currentPageSize = pageSize ?? table.getState().pagination.pageSize;

  useEffect(() => {
    if (!showColumnsMenu) {
      return;
    }

    const closeOnOutsideClick = (event) => {
      if (!columnsMenuRef.current?.contains(event.target)) {
        setShowColumnsMenu(false);
      }
    };

    window.addEventListener('pointerdown', closeOnOutsideClick);
    return () => window.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [showColumnsMenu]);

  const getHeaderLabel = (cell) => {
    const header = cell.column.columnDef.header;
    return typeof header === 'string' ? header : cell.column.id;
  };

  return (
    <section className="admin-table portal-animate-in">
      <header className="admin-table-toolbar">
        <h2>{title}</h2>
        <div className="admin-table-controls">
          <input
            type="search"
            value={globalFilter}
            onChange={(event) => onGlobalFilterChange(event.target.value)}
            placeholder="Search records..."
            aria-label={`Filter ${title}`}
          />
          <div className="admin-column-toggle" ref={columnsMenuRef}>
            <button
              type="button"
              className="admin-column-toggle-trigger"
              onClick={() => setShowColumnsMenu((prev) => !prev)}
              aria-expanded={showColumnsMenu}
              aria-haspopup="menu"
            >
              Columns
              <span>{showColumnsMenu ? '▴' : '▾'}</span>
            </button>

            <AnimatePresence>
              {showColumnsMenu && (
                <MotionDiv
                  className="admin-column-toggle-panel"
                  role="menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                >
                  {table
                    .getAllLeafColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <label key={column.id}>
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                        />
                        {column.columnDef.header}
                      </label>
                    ))}
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
          <button type="button" className="btn btn-forest">
            {createButtonLabel}
          </button>
        </div>
      </header>

      <MotionDiv
        className="admin-table-wrap"
        key={`${table.getState().pagination.pageIndex}-${globalFilter}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === 'asc' && ' ↑'}
                        {header.column.getIsSorted() === 'desc' && ' ↓'}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} data-label={getHeaderLabel(cell)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllLeafColumns().length}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </MotionDiv>

      <footer className="admin-table-pagination">
        <p>
          Showing {table.getRowModel().rows.length} of {table.getPreFilteredRowModel().rows.length}{' '}
          rows
        </p>
        <div className="admin-table-pagination-controls">
          <label className="admin-table-page-size" htmlFor={`${title}-page-size`}>
            Rows
            <select
              id={`${title}-page-size`}
              value={currentPageSize}
              onChange={(event) => {
                const nextPageSize = Number(event.target.value);
                table.setPageSize(nextPageSize);
                onPageSizeChange?.(nextPageSize);
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
