import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { getApplicants } from '../services/applicantsService';

function mapApplicantRow(item) {
  const status = item.reviewed ? (item.approved ? 'Approved' : 'Denied') : 'Pending';

  return {
    id: item.id,
    name: `${item.firstName} ${item.lastName}`,
    email: item.email,
    date: item.createdAt?.slice(0, 10) || '-',
    program: item.projectAppliedFor,
    status,
  };
}

export function useApplicantsTable({ pageSize = 5, onAction = () => {} } = {}) {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplicants = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getApplicants({ pageIndex: 0, pageSize: 200, keyword: globalFilter });
      const rows = (response?.content || []).map(mapApplicantRow);
      setData(rows);
    } catch (err) {
      setError(err?.message || 'Unable to load applicants.');
    } finally {
      setLoading(false);
    }
  }, [globalFilter]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', enableHiding: false },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'date', header: 'Applied Date' },
      { accessorKey: 'program', header: 'Program' },
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
            <button type="button" onClick={() => onAction('approve', row.original)}>
              Approve
            </button>
            <button type="button" onClick={() => onAction('deny', row.original)}>
              Deny
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
    reload: loadApplicants,
  };
}
