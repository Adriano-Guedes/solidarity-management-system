import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiUsers, 
  FiGift, 
  FiTruck, 
  FiBox, 
  FiTag, 
  FiHeart,
  FiSettings
} from 'react-icons/fi';

interface SidebarProps {
  collapsed: boolean;
}

const menuSections = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
    ]
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Famílias', path: '/families', icon: <FiUsers /> },
      { label: 'Doações', path: '/donations', icon: <FiGift /> },
      { label: 'Entregas', path: '/deliveries', icon: <FiTruck /> },
    ]
  },
  {
    label: 'Estoque',
    items: [
      { label: 'Itens', path: '/items', icon: <FiBox /> },
      { label: 'Categorias', path: '/item-categories', icon: <FiTag /> },
    ]
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Configurações', path: '/settings', icon: <FiSettings /> },
    ]
  }
];

const Sidebar = ({ collapsed }: SidebarProps) => {
  return (
    <aside
      id="sidebar"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        height: '100vh',
        background: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition)',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <a href="/dashboard" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        minHeight: 'var(--topbar-height)',
        textDecoration: 'none',
      }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'var(--primary)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontSize: '18px',
          color: '#fff',
        }}>
          <FiHeart />
        </div>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
              DoacoesGest
            </span>
            <span style={{ fontSize: '11px', color: 'var(--sidebar-text)', whiteSpace: 'nowrap' }}>
              Gestão de Doações
            </span>
          </div>
        )}
      </a>

      <nav className="sidebar-nav" style={{
        flex: 1,
        padding: '12px 8px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {menuSections.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <div style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(199, 210, 254, 0.45)',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                padding: '12px 12px 6px',
                whiteSpace: 'nowrap',
              }}>
                {section.label}
              </div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '10px' : '10px 12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '2px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'all var(--transition)'
                }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, width: '24px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ overflow: 'hidden' }}>{item.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
