import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { getUsers } from '../services/usersService';

function mapUserRow(item) {
  return {
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    role: item.role,
    status: 'Active',
    username: item.username,
    phoneNumber: item.phoneNumber,
    profilePicture: item.profilePicture,
  };
}

export function useUsersTable({ pageSize = 5, onAction = () => {} } = {}) {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getUsers({ pageIndex: 0, pageSize: 200, keyword: globalFilter });
      const rows = (response?.content || []).map(mapUserRow);
      setData(rows);
    } catch (err) {
      setError(err?.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }, [globalFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
    loading,
    error,
    reload: loadUsers,
  };
}
