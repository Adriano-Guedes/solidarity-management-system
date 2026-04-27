import Sidebar from '../components/Sidebar';

const DashboardPage = () => (
  <div style={{ display: 'flex', background: '#F8FAFC', minHeight: '100vh' }}>
    <Sidebar />
    <main style={{ flex: 1, padding: 40, background: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#0B1F3A' }}>Dashboard</h1>
      <p style={{ color: '#475569' }}>Welcome to the Solidarity Management System!</p>
    </main>
  </div>
);

export default DashboardPage;
