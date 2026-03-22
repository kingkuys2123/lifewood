import { useMemo, useState } from 'react';
import AdminDataTable from '../../components/shared/admin-table/AdminDataTable';
import ActionModal from '../../components/shared/portal-modal/ActionModal';
import { deleteUser } from './services/usersService';
import UsersSummary from './components/UsersSummary';
import { useUsersTable } from './hooks/useUsersTable';
import './styles/UsersPage.css';

export default function UsersPage() {
  const [pageSize, setPageSize] = useState(5);
  const [modalState, setModalState] = useState({ open: false, action: '', row: null });
  const [actionError, setActionError] = useState('');

  const handleAction = (action, row) => {
    setActionError('');
    setModalState({ open: true, action, row });
  };

  const { table, globalFilter, setGlobalFilter, loading, error, reload } = useUsersTable({
    pageSize,
    onAction: handleAction,
  });

  const modalContent = useMemo(() => {
    if (!modalState.row) {
      return null;
    }

    const fullName = `${modalState.row.firstName} ${modalState.row.lastName}`;
    const map = {
      view: {
        title: 'View user details',
        message: `Preview ${fullName} (${modalState.row.email}) profile information.`,
        confirmLabel: 'Close',
      },
      edit: {
        title: 'Edit user',
        message: `Editing via modal is not enabled yet. Go to profile/settings for updates.`,
        confirmLabel: 'Close',
      },
      delete: {
        title: 'Delete user?',
        message: `Remove ${fullName} from the admin portal access list.`,
        confirmLabel: 'Delete User',
        tone: 'danger',
      },
    };

    return map[modalState.action] ?? null;
  }, [modalState.action, modalState.row]);

  const onConfirm = async () => {
    if (!modalState.row) {
      return;
    }

    if (modalState.action !== 'delete') {
      setModalState({ open: false, action: '', row: null });
      return;
    }

    try {
      await deleteUser(modalState.row.id);
      setModalState({ open: false, action: '', row: null });
      await reload();
    } catch (err) {
      setActionError(err?.message || 'Unable to delete user.');
    }
  };

  return (
    <section className="portal-page">
      <UsersSummary />

      {error ? <p className="portal-page-error">{error}</p> : null}
      {actionError ? <p className="portal-page-error">{actionError}</p> : null}

      {loading ? (
        <div className="portal-table-loading">Loading users...</div>
      ) : (
        <AdminDataTable
          title="Users"
          table={table}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          createButtonLabel="Create User"
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}

      <ActionModal
        isOpen={modalState.open && Boolean(modalContent)}
        title={modalContent?.title ?? ''}
        message={modalContent?.message ?? ''}
        confirmLabel={modalContent?.confirmLabel ?? 'Confirm'}
        tone={modalContent?.tone ?? 'default'}
        onClose={() => setModalState({ open: false, action: '', row: null })}
        onConfirm={onConfirm}
      />
    </section>
  );
}
