import Sidebar from '../components/Sidebar';

const FamilyMembersPage = () => (
  <div style={{ display: 'flex', background: '#F8FAFC', minHeight: '100vh' }}>
    <Sidebar />
    <main style={{ flex: 1, padding: 40, background: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#0B1F3A' }}>Family Members</h1>
    </main>
  </div>
);

export default FamilyMembersPage;
