import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';

interface TopBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const fakeUser = {
  name: 'Adriano Guedes',
  role: 'Administrador',
  initials: 'AG'
};

const TopBar = ({ collapsed, onToggle }: TopBarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header
      id="topbar"
      style={{
        position: 'fixed',
        top: 0,
        left: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        right: 0,
        height: 'var(--topbar-height)',
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        zIndex: 900,
        transition: 'left var(--transition)',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '38px', height: '38px',
          border: 'none',
          background: 'transparent',
          borderRadius: '8px',
          color: 'var(--text-muted)',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background var(--transition), color var(--transition)',
          flexShrink: 0,
        }}
      >
        <FiMenu />
      </button>

      <div style={{ flex: 1 }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }} className="d-none d-sm-block">
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.2' }}>
              {fakeUser.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {fakeUser.role}
            </div>
          </div>
          
          <div style={{
            width: '38px', height: '38px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 700, 
            fontSize: '13px',
            cursor: 'pointer',
            flexShrink: 0
          }}>
            {fakeUser.initials}
          </div>
        </div>

        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }}></div>

        <button 
          onClick={handleLogout}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--danger)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background 0.2s'
          }}
          className="logout-btn-hover"
        >
          <FiLogOut style={{ fontSize: '18px' }} />
          <span className="d-none d-md-inline">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
