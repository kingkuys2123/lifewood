import AdminDataTable from '../../components/shared/admin-table/AdminDataTable';
import UsersSummary from './components/UsersSummary';
import { useUsersTable } from './hooks/useUsersTable';
import './styles/UsersPage.css';

export default function UsersPage() {
  const { table, globalFilter, setGlobalFilter } = useUsersTable();

  return (
    <section className="portal-page">
      <UsersSummary />
      <AdminDataTable
        title="Users"
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        createButtonLabel="Create User"
      />
    </section>
  );
}
