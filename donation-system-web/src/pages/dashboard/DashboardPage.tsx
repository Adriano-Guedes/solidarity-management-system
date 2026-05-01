import { FiGift, FiUsers, FiTruck, FiBox, FiTrendingUp, FiTrendingDown, FiUserPlus, FiArrowRight, FiTag, FiAlertCircle } from 'react-icons/fi';

const DashboardPage = () => {
  return (
    <div>
      {/* ── Stats row ── */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Doações', value: '1.284', icon: <FiGift />, trend: '12%', up: true, color: 'primary' },
          { label: 'Famílias Atendidas', value: '328', icon: <FiUsers />, trend: '8%', up: true, color: 'success' },
          { label: 'Entregas Pendentes', value: '47', icon: <FiTruck />, trend: 'Estável', up: null, color: 'warning' },
          { label: 'Itens em Estoque', value: '892', icon: <FiBox />, trend: '5%', up: false, color: 'info' },
        ].map((stat, i) => (
          <div key={i} className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
              <div className="stat-body">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-trend ${stat.up === true ? 'up' : stat.up === false ? 'down' : 'neutral'}`}>
                  {stat.up === true ? <FiTrendingUp /> : stat.up === false ? <FiTrendingDown /> : ''} {stat.trend}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {/* Recent Activity */}
        <div className="col-12 col-xl-8">
          <div className="card h-100">
            <div className="card-header-custom">
              <div>
                <div className="card-title">Entregas Recentes</div>
                <div className="card-subtitle">Últimas movimentações registradas</div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn-ghost">Filtrar</button>
                <button className="btn-ghost">Exportar</button>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Família</th>
                    <th>Itens</th>
                    <th>Categoria</th>
                    <th>Data</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { fam: 'Silva & Santos', members: '4 membros', items: 'Cesta básica × 2', cat: 'Alimentos', catColor: '#f59e0b', date: '29 abr 2026', status: 'delivered', statusLabel: 'Entregue' },
                    { fam: 'Família Oliveira', members: '7 membros', items: 'Roupas, Brinquedos', cat: 'Vestuário', catColor: '#3b82f6', date: '28 abr 2026', status: 'pending', statusLabel: 'Pendente' },
                    { fam: 'Família Costa', members: '2 membros', items: 'Medicamentos', cat: 'Saúde', catColor: '#10b981', date: '27 abr 2026', status: 'partial', statusLabel: 'Parcial' },
                    { fam: 'Família Ferreira', members: '5 membros', items: 'Cesta básica × 1', cat: 'Alimentos', catColor: '#f59e0b', date: '26 abr 2026', status: 'cancelled', statusLabel: 'Cancelado' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{row.fam}</strong>
                        <div className="td-muted">{row.members}</div>
                      </td>
                      <td>{row.items}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                          borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: 'var(--body-bg)',
                          border: '1px solid var(--border)', color: 'var(--text-muted)'
                        }}>
                          <FiTag style={{ color: row.catColor }} /> {row.cat}
                        </span>
                      </td>
                      <td className="td-muted">{row.date}</td>
                      <td><span className={`badge-status badge-${row.status}`}>{row.statusLabel}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <button className="btn btn-link text-decoration-none p-0 fw-600" style={{ color: 'var(--primary)', fontSize: '13px' }}>
                Ver todas as movimentações <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-3">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header-custom">
              <div className="card-title">Ações Rápidas</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px 24px' }}>
              {[
                { label: 'Nova Família', icon: <FiUserPlus />, bg: '#eef2ff', color: '#4f46e5' },
                { label: 'Registrar Doação', icon: <FiGift />, bg: '#d1fae5', color: '#10b981' },
                { label: 'Agendar Entrega', icon: <FiTruck />, bg: '#fef3c7', color: '#f59e0b' },
                { label: 'Adicionar Item', icon: <FiBox />, bg: '#dbeafe', color: '#3b82f6' },
              ].map((act, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '18px 12px',
                  background: 'var(--body-bg)', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }} className="quick-action-hover">
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '20px', background: act.bg, color: act.color
                  }}>{act.icon}</div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', textAlign: 'center' }}>{act.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <div className="card-header-custom">
              <div>
                <div className="card-title">Atividade Recente</div>
              </div>
            </div>
            <div style={{ padding: '8px 24px 20px' }}>
              {[
                { text: 'Família Rodrigues cadastrada', time: 'Há 15 min', icon: <FiUserPlus />, bg: '#eef2ff', color: '#4f46e5' },
                { text: 'Doação de 50 itens registrada', time: 'Há 1 hora', icon: <FiGift />, bg: '#d1fae5', color: '#10b981' },
                { text: 'Estoque de Alimentos baixo', time: 'Há 5 horas', icon: <FiAlertCircle />, bg: '#fee2e2', color: '#ef4444' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i === 2 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '16px', flexShrink: 0, background: item.bg, color: item.color
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-main)' }}><strong>{item.text}</strong></div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
