import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { getUsers } from '../services/usersService';

export function useUsersTable({ pageSize = 5, onAction = () => {} } = {}) {
  const data = useMemo(() => getUsers(), []);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <span className="admin-tag">{row.original.status}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="action-group">
            <button type="button" onClick={() => onAction('view', row.original)}>
              View
            </button>
            <button type="button" onClick={() => onAction('edit', row.original)}>
              Edit
            </button>
            <button type="button" onClick={() => onAction('delete', row.original)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onAction],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
  };
}
