import { flexRender } from '@tanstack/react-table';
import './AdminDataTable.css';

export default function AdminDataTable({
  title,
  table,
  globalFilter,
  onGlobalFilterChange,
  createButtonLabel,
}) {
  return (
    <section className="admin-table">
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
          <details className="admin-column-toggle">
            <summary>Columns</summary>
            <div className="admin-column-toggle-panel">
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
            </div>
          </details>
          <button type="button" className="btn btn-forest">
            {createButtonLabel}
          </button>
        </div>
      </header>

      <div className="admin-table-wrap">
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
                    <td key={cell.id}>
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
      </div>

      <footer className="admin-table-pagination">
        <p>
          Showing {table.getRowModel().rows.length} of {table.getPreFilteredRowModel().rows.length}{' '}
          rows
        </p>
        <div className="admin-table-pagination-controls">
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
