import { useMemo, useState } from 'react';
import AdminDataTable from '../../components/shared/admin-table/AdminDataTable';
import ActionModal from '../../components/shared/portal-modal/ActionModal';
import {
  approveApplicant,
  createApplicant,
  denyApplicant,
  fetchApplicantById,
  getApplicantResumeUrl,
} from './services/applicantsService';
import ApplicantsSummary from './components/ApplicantsSummary';
import { useApplicantsTable } from './hooks/useApplicantsTable';
import { useToast } from '../../app/providers/useToast';
import './styles/ApplicantsPage.css';

const INITIAL_CREATE_FORM = {
  firstName: '',
  lastName: '',
  age: '',
  email: '',
  degree: '',
  projectAppliedFor: '',
  experience: '',
  resume: null,
};

export default function ApplicantsPage() {
  const [pageSize, setPageSize] = useState(5);
  const [modalState, setModalState] = useState({ open: false, action: '', row: null });
  const [loadingAction, setLoadingAction] = useState(false);
  const [detail, setDetail] = useState(null);
  const [decisionMessage, setDecisionMessage] = useState('');
  const [createForm, setCreateForm] = useState(INITIAL_CREATE_FORM);
  const toast = useToast();

  const handleAction = (action, row) => {
    setDecisionMessage('');
    setModalState({ open: true, action, row });

    if (action === 'view' && row?.id) {
      fetchApplicantById(row.id)
        .then(setDetail)
        .catch((err) => toast.error(err?.message || 'Unable to load applicant details.'));
    } else {
      setDetail(null);
    }
  };

  const { table, globalFilter, setGlobalFilter, loading, error, reload } = useApplicantsTable({
    pageSize,
    onAction: handleAction,
  });

  const modalContent = useMemo(() => {
    if (modalState.action === 'create') {
      return {
        title: 'Create applicant',
        confirmLabel: 'Create Applicant',
      };
    }

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
    if (modalState.action === 'view') {
      setModalState({ open: false, action: '', row: null });
      setDetail(null);
      return;
    }

    if (modalState.action === 'create') {
      try {
        setLoadingAction(true);
        const formData = new FormData();
        formData.append('firstName', createForm.firstName.trim());
        formData.append('lastName', createForm.lastName.trim());
        formData.append('age', String(createForm.age));
        formData.append('email', createForm.email.trim());
        formData.append('degree', createForm.degree.trim());
        formData.append('projectAppliedFor', createForm.projectAppliedFor.trim());
        formData.append('experience', createForm.experience.trim());
        if (createForm.resume) {
          formData.append('resume', createForm.resume);
        }
        await createApplicant(formData);
        toast.success('Applicant created successfully.');
        setCreateForm(INITIAL_CREATE_FORM);
        setModalState({ open: false, action: '', row: null });
        await reload();
      } catch (err) {
        toast.error(err?.message || 'Unable to create applicant.');
      } finally {
        setLoadingAction(false);
      }
      return;
    }

    if (!modalState.row) {
      return;
    }

    try {
      setLoadingAction(true);
      if (modalState.action === 'approve') {
        await approveApplicant({ applicantId: modalState.row.id, message: decisionMessage });
        toast.success('Applicant approved successfully.');
      } else if (modalState.action === 'deny') {
        await denyApplicant({ applicantId: modalState.row.id, message: decisionMessage });
        toast.success('Applicant denied successfully.');
      }

      setModalState({ open: false, action: '', row: null });
      setDecisionMessage('');
      await reload();
    } catch (err) {
      toast.error(err?.message || 'Unable to process applicant action.');
    } finally {
      setLoadingAction(false);
    }
  };

  const resumeUrl = modalState.row?.id ? getApplicantResumeUrl(modalState.row.id) : '';

  return (
    <section className="portal-page">
      <ApplicantsSummary />

      {error ? <p className="portal-page-error">{error}</p> : null}

      {loading ? (
        <div className="portal-table-loading">Loading applicants...</div>
      ) : (
        <AdminDataTable
          title="Applicants"
          table={table}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          createButtonLabel="Create Applicant"
          onCreate={() => handleAction('create', null)}
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
        loading={loadingAction}
        hideCancel={modalState.action === 'view'}
        onClose={() => setModalState({ open: false, action: '', row: null })}
        onConfirm={onConfirm}
      >
        {modalState.action === 'create' ? (
          <div className="action-modal-grid">
            <div className="action-modal-field">
              <label htmlFor="app-first-name">First Name</label>
              <input
                id="app-first-name"
                value={createForm.firstName}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, firstName: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="app-last-name">Last Name</label>
              <input
                id="app-last-name"
                value={createForm.lastName}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, lastName: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="app-age">Age</label>
              <input
                id="app-age"
                type="number"
                min="16"
                max="100"
                value={createForm.age}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, age: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="app-email">Email</label>
              <input
                id="app-email"
                type="email"
                value={createForm.email}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="app-degree">Degree</label>
              <input
                id="app-degree"
                value={createForm.degree}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, degree: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="app-project">Project Applied For</label>
              <input
                id="app-project"
                value={createForm.projectAppliedFor}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, projectAppliedFor: event.target.value }))}
              />
            </div>
            <div className="action-modal-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="app-experience">Experience</label>
              <textarea
                id="app-experience"
                value={createForm.experience}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, experience: event.target.value }))}
              />
            </div>
            <div className="action-modal-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="app-resume">Resume (PDF, DOC, DOCX)</label>
              <input
                id="app-resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => setCreateForm((prev) => ({ ...prev, resume: event.target.files?.[0] || null }))}
              />
            </div>
          </div>
        ) : null}

        {modalState.action === 'view' && modalState.row ? (
          <>
            <div className="action-modal-meta">
              <p><strong>Name:</strong> {detail ? `${detail.firstName} ${detail.lastName}` : modalState.row.name}</p>
              <p><strong>Email:</strong> {detail?.email || modalState.row.email}</p>
              <p><strong>Program:</strong> {detail?.projectAppliedFor || modalState.row.program}</p>
              <p><strong>Degree:</strong> {detail?.degree || '-'}</p>
              <p><strong>Experience:</strong> {detail?.experience || '-'}</p>
            </div>
            <div className="action-modal-resume-actions">
              <a href={getApplicantResumeUrl(modalState.row.id)} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Preview Resume
              </a>
              <a href={getApplicantResumeUrl(modalState.row.id, { download: true })} className="btn btn-forest">
                Download Resume
              </a>
            </div>
            <div className="action-modal-resume-preview">
              <iframe title="Applicant resume preview" src={resumeUrl} loading="lazy" />
            </div>
          </>
        ) : null}

        {(modalState.action === 'approve' || modalState.action === 'deny') ? (
          <div className="action-modal-field">
            <label htmlFor="decision-message">Optional Message to Applicant</label>
            <textarea
              id="decision-message"
              value={decisionMessage}
              onChange={(event) => setDecisionMessage(event.target.value)}
              placeholder="Share a short note that will appear in the decision email."
            />
          </div>
        ) : null}
      </ActionModal>
    </section>
  );
}
