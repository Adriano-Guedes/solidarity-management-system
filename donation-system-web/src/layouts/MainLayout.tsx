import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { FiPlus } from 'react-icons/fi';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [onAddClick, setOnAddClick] = useState<(() => void) | null>(null);
  const location = useLocation();

  const getTitle = (pathname: string) => {
    const path = pathname.split('/')[1];
    switch (path) {
      case 'dashboard': return 'Dashboard';
      case 'families': return 'Gestão de Famílias';
      case 'donations': return 'Registro de Doações';
      case 'deliveries': return 'Logística de Entregas';
      case 'items': return 'Controle de Itens';
      case 'item-categories': return 'Categorias de Itens';
      case 'inventory-batches': return 'Lotes de Inventário';
      case 'users': return 'Gestão de Usuários';
      default: return 'Solidarity';
    }
  };

  const getSubTitle = (pathname: string) => {
    const path = pathname.split('/')[1];
    switch (path) {
      case 'dashboard': return 'Visão geral do sistema';
      default: return 'Gerenciamento estratégico';
    }
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  const isDetailPage = 
    location.pathname.includes('/items/') || 
    location.pathname.includes('/item-categories/') || 
    location.pathname.includes('/donations/') || 
    location.pathname.includes('/members');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--body-bg)' }}>
      <Sidebar collapsed={collapsed} />
      
      <div style={{
        flex: 1,
        marginLeft: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        transition: 'margin-left var(--transition)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <TopBar collapsed={collapsed} onToggle={toggleSidebar} />
        
        <main style={{
          marginTop: 'var(--topbar-height)',
          padding: '28px 28px',
          minHeight: 'calc(100vh - var(--topbar-height))',
        }}>
          {/* Page Header (Global on layout but can be overridden) */}
          {!isDetailPage && location.pathname !== '/dashboard' && (
            <div className="page-header mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{getTitle(location.pathname)}</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    <li className="breadcrumb-item active">{getSubTitle(location.pathname)}</li>
                  </ol>
                </nav>
              </div>
              <button 
                className="btn-primary-custom" 
                style={{ height: 'fit-content', background: 'var(--success)', border: 'none' }}
                onClick={() => onAddClick?.()}
              >
                <FiPlus /> Novo Registro
              </button>
            </div>
          )}

          <div className="container-fluid p-0">
            <Outlet context={{ setOnAddClick }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
