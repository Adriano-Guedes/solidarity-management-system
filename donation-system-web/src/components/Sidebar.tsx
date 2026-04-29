import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiGift, FiTruck, FiBox, FiLayers, FiTag, FiUser } from 'react-icons/fi';
import { COLORS } from '../constants';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
  { label: 'Famílias', path: '/families', icon: <FiUsers /> },
  { label: 'Doações', path: '/donations', icon: <FiGift /> },
  { label: 'Entregas', path: '/deliveries', icon: <FiTruck /> },
  { label: 'Itens', path: '/items', icon: <FiBox /> },
  { label: 'Categorias', path: '/item-categories', icon: <FiTag /> },
  // { label: 'Users', path: '/users', icon: <FiUser /> },
];

const fakeUser = {
  name: 'Admin',
  email: 'admin@system.com',
};

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside
      style={{
        width: 240,
        height: '100vh',
        background: COLORS.primary,
        color: COLORS.white,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        left: 0,
        top: 0,
        boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
        zIndex: 100,
      }}
    >
      <nav style={{ padding: '32px 0 0 0' }}>
        <h2 style={{ textAlign: 'center', color: COLORS.accent, marginBottom: 32, letterSpacing: 1 }}>Solidarity</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 32px',
                  color: isActive ? COLORS.accent : COLORS.white,
                  background: isActive ? COLORS.secondary : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? 'bold' : 'normal',
                  borderLeft: isActive ? `4px solid ${COLORS.accent}` : '4px solid transparent',
                  transition: 'all 0.2s',
                  fontSize: 16,
                })}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ padding: 24, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ marginBottom: 8 }}>
          <strong>{fakeUser.name}</strong>
          <div style={{ fontSize: 12, color: COLORS.accent }}>{fakeUser.email}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: 8,
            background: COLORS.secondary,
            color: COLORS.white,
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: 8,
            transition: 'background 0.2s',
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
