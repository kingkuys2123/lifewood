import { useMemo, useState } from 'react';
import AdminDataTable from '../../components/shared/admin-table/AdminDataTable';
import ActionModal from '../../components/shared/portal-modal/ActionModal';
import { approveApplicant, denyApplicant } from './services/applicantsService';
import ApplicantsSummary from './components/ApplicantsSummary';
import { useApplicantsTable } from './hooks/useApplicantsTable';
import './styles/ApplicantsPage.css';

export default function ApplicantsPage() {
  const [pageSize, setPageSize] = useState(5);
  const [modalState, setModalState] = useState({ open: false, action: '', row: null });
  const [actionError, setActionError] = useState('');

  const handleAction = (action, row) => {
    setActionError('');
    setModalState({ open: true, action, row });
  };

  const { table, globalFilter, setGlobalFilter, loading, error, reload } = useApplicantsTable({
    pageSize,
    onAction: handleAction,
  });

  const modalContent = useMemo(() => {
    if (!modalState.row) {
      return null;
    }

    const map = {
      view: {
        title: 'Applicant details',
        message: `Review profile and timeline for ${modalState.row.name}.`,
        confirmLabel: 'Close',
      },
      approve: {
        title: 'Approve applicant?',
        message: `Approve ${modalState.row.name} for ${modalState.row.program}.`,
        confirmLabel: 'Approve',
      },
      deny: {
        title: 'Deny applicant?',
        message: `Deny ${modalState.row.name} for ${modalState.row.program}.`,
        confirmLabel: 'Deny',
        tone: 'danger',
      },
    };

    return map[modalState.action] ?? null;
  }, [modalState.action, modalState.row]);

  const onConfirm = async () => {
    if (!modalState.row) {
      return;
    }

    try {
      if (modalState.action === 'approve') {
        await approveApplicant({ applicantId: modalState.row.id, message: '' });
      } else if (modalState.action === 'deny') {
        await denyApplicant({ applicantId: modalState.row.id, message: '' });
      }

      setModalState({ open: false, action: '', row: null });
      await reload();
    } catch (err) {
      setActionError(err?.message || 'Unable to process applicant action.');
    }
  };

  return (
    <section className="portal-page">
      <ApplicantsSummary />

      {error ? <p className="portal-page-error">{error}</p> : null}
      {actionError ? <p className="portal-page-error">{actionError}</p> : null}

      {loading ? (
        <div className="portal-table-loading">Loading applicants...</div>
      ) : (
        <AdminDataTable
          title="Applicants"
          table={table}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          createButtonLabel="Create Applicant"
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
