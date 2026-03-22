import { useMemo, useState } from 'react';
import AdminDataTable from '../../components/shared/admin-table/AdminDataTable';
import ActionModal from '../../components/shared/portal-modal/ActionModal';
import UsersSummary from './components/UsersSummary';
import { useUsersTable } from './hooks/useUsersTable';
import './styles/UsersPage.css';

export default function UsersPage() {
  const [pageSize, setPageSize] = useState(5);
  const [modalState, setModalState] = useState({ open: false, action: '', row: null });

  const handleAction = (action, row) => {
    setModalState({ open: true, action, row });
  };

  const { table, globalFilter, setGlobalFilter } = useUsersTable({
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
        message: `Open editable settings for ${fullName}.`,
        confirmLabel: 'Continue',
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

  return (
    <section className="portal-page">
      <UsersSummary />
      <AdminDataTable
        title="Users"
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        createButtonLabel="Create User"
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <ActionModal
        isOpen={modalState.open && Boolean(modalContent)}
        title={modalContent?.title ?? ''}
        message={modalContent?.message ?? ''}
        confirmLabel={modalContent?.confirmLabel ?? 'Confirm'}
        tone={modalContent?.tone ?? 'default'}
        onClose={() => setModalState({ open: false, action: '', row: null })}
        onConfirm={() => setModalState({ open: false, action: '', row: null })}
      />
    </section>
  );
}
