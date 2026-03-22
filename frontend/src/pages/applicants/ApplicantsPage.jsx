import AdminDataTable from '../../components/shared/admin-table/AdminDataTable';
import ApplicantsSummary from './components/ApplicantsSummary';
import { useApplicantsTable } from './hooks/useApplicantsTable';
import './styles/ApplicantsPage.css';

export default function ApplicantsPage() {
  const { table, globalFilter, setGlobalFilter } = useApplicantsTable();

  return (
    <section className="portal-page">
      <ApplicantsSummary />
      <AdminDataTable
        title="Applicants"
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        createButtonLabel="Create Applicant"
      />
    </section>
  );
}
