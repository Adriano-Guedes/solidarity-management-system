import React, { useEffect, useState } from 'react';
import {
  FiGift, FiUsers, FiTruck, FiBox, FiUserPlus, FiArrowRight,
  FiAlertCircle, FiClock, FiActivity, FiLayers,
  FiEye
} from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { dashboardService } from '../../features/dashboard/dashboardService';
import { createFamily } from '../../features/families/familyService';
import { createDonation } from '../../features/donations/donationService';
import { createItem } from '../../features/items/itemService';
import type {
  DashboardSummaryResponse,
  DashboardEvolutionResponse,
  DashboardCategoryDistributionResponse,
  DashboardFamilyWaitListResponse,
  DashboardExpiringBatchResponse
} from '../../types/dashboard';
import type { CreateFamilyRequest } from '../../types/family';
import type { CreateDonationRequest } from '../../types/donation';
import type { CreateItemRequest } from '../../types/item';

import FamilyCreateModal from '../../features/families/components/FamilyCreateModal';
import DonationCreateModal from '../../features/donations/components/DonationCreateModal';
import ItemCreateModal from '../../features/items/components/ItemCreateModal';

import LoadingModal from '../../components/LoadingModal';
import { formatDateBR } from '../../utils/dateFormat';
import { COLORS } from '../../constants/colors';
import { notificationService } from '../../utils/toastUtils';

import { useNavigate } from 'react-router-dom';

const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [evolution, setEvolution] = useState<DashboardEvolutionResponse[]>([]);
  const [distribution, setDistribution] = useState<DashboardCategoryDistributionResponse[]>([]);
  const [waitList, setWaitList] = useState<DashboardFamilyWaitListResponse[]>([]);
  const [expiringBatches, setExpiringBatches] = useState<DashboardExpiringBatchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Actions Modals States
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        summaryRes,
        evolutionRes,
        distributionRes,
        waitListRes,
        expiringBatchesRes
      ] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getEvolution(),
        dashboardService.getDistribution(),
        dashboardService.getWaitList(),
        dashboardService.getExpiringBatches()
      ]);

      setSummary(summaryRes);
      setEvolution(evolutionRes);
      setDistribution(distributionRes);

      // Sort waitList by daysSinceLastDelivery descending
      const sortedWaitList = [...waitListRes].sort((a, b) => b.daysSinceLastDelivery - a.daysSinceLastDelivery);
      setWaitList(sortedWaitList);

      setExpiringBatches(expiringBatchesRes);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFamily = async (data: CreateFamilyRequest) => {
    setSaving(true);
    try {
      const newFamily = await createFamily(data);
      notificationService.success('Família cadastrada com sucesso!');
      setShowFamilyModal(false);
      navigate(`/families/${newFamily.id}`);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateDonation = async (data: CreateDonationRequest) => {
    setSaving(true);
    try {
      await createDonation(data);
      notificationService.success('Doação registrada com sucesso!');
      setShowDonationModal(false);
      await fetchData();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateItem = async (data: CreateItemRequest) => {
    setSaving(true);
    try {
      await createItem(data);
      notificationService.success('Item cadastrado com sucesso!');
      setShowItemModal(false);
      await fetchData();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-4">
      <LoadingModal show={loading} />

      {/* ── Summary Row ── */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="stat-card">
            <div className="stat-icon success"><FiUsers /></div>
            <div className="stat-body">
              <div className="stat-label">Famílias Atendidas</div>
              <div className="stat-value">
                {summary?.activeFamiliesServedThisMonth ?? 0}
                <span className="stat-total-label"> / {summary?.totalActiveFamilies ?? 0} ativas</span>
              </div>
              <div className="stat-trend neutral">
                <FiActivity /> {summary?.totalPeopleImpactedThisMonth ?? 0} pessoas impactadas
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card">
            <div className="stat-icon warning"><FiTruck /></div>
            <div className="stat-body">
              <div className="stat-label">Entregas no Mês</div>
              <div className="stat-value">{summary?.deliveriesThisMonth ?? 0}</div>
              <div className="stat-trend neutral">Movimentações este mês</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card">
            <div className="stat-icon primary"><FiGift /></div>
            <div className="stat-body">
              <div className="stat-label">Doações no Mês</div>
              <div className="stat-value">{summary?.donationsThisMonth ?? 0}</div>
              <div className="stat-trend neutral">Itens recebidos este mês</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {/* Evolution Chart */}
        <div className="col-12 col-xl-8">
          <div className="card h-100">
            <div className="card-header-custom">
              <div>
                <div className="card-title">Evolução (Últimos 30 dias)</div>
                <div className="card-subtitle">Comparativo entre entregas e doações</div>
              </div>
            </div>
            <div className="card-body" style={{ height: '350px', padding: '24px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    dy={10}
                    tickFormatter={(val) => {
                      if (!val || typeof val !== 'string') return '';
                      const parts = val.split(/[-T/]/);
                      if (parts.length >= 3) {
                        // Assume YYYY-MM-DD ou similar
                        const year = parseInt(parts[0]);
                        const month = parseInt(parts[1]) - 1;
                        const day = parseInt(parts[2]);
                        const date = new Date(year, month, day);
                        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                      }
                      return val;
                    }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelFormatter={(val) => {
                      if (!val || typeof val !== 'string') return '';
                      const parts = val.split(/[-T/]/);
                      if (parts.length >= 3) {
                        const year = parseInt(parts[0]);
                        const month = parseInt(parts[1]) - 1;
                        const day = parseInt(parts[2]);
                        const date = new Date(year, month, day);
                        return date.toLocaleDateString('pt-BR');
                      }
                      return val;
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    name="Entregas"
                    type="monotone"
                    dataKey="deliveries"
                    stroke={COLORS.warning}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    name="Doações"
                    type="monotone"
                    dataKey="donations"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="col-12 col-xl-4">
          <div className="card h-100">
            <div className="card-header-custom">
              <div>
                <div className="card-title">Distribuição por Categoria</div>
                <div className="card-subtitle">Itens entregues por categoria</div>
              </div>
            </div>
            <div className="card-body" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="category"
                    >
                      {distribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted">Sem dados de distribuição</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {/* Priority Table */}
        <div className="col-12 col-xl-8">
          <div className="card h-100">
            <div className="card-header-custom">
              <div>
                <div className="card-title">Prioridades de Atendimento</div>
                <div className="card-subtitle">Famílias sem entregas há mais de 30 dias</div>
              </div>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Família</th>
                    <th>Última Entrega</th>
                    <th>Dias de Espera</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {waitList.length > 0 ? waitList.map((fam) => (
                    <tr key={fam.familyId}>
                      <td><strong>{fam.familyName}</strong></td>
                      <td className="td-muted">{fam.lastDeliveryDate ? formatDateBR(fam.lastDeliveryDate) : 'Nunca recebeu'}</td>
                      <td>
                        {fam.daysSinceLastDelivery >= 999 ? (
                          <span className="badge bg-warning-subtle text-warning-emphasis" style={{ padding: '4px 8px', borderRadius: '6px' }}>
                            Sem histórico
                          </span>
                        ) : (
                          <span className={`badge ${fam.daysSinceLastDelivery > 45 ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'}`} style={{ padding: '4px 8px', borderRadius: '6px' }}>
                            {fam.daysSinceLastDelivery} dias
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-icon-sm text-primary"
                          title="Ver detalhes"
                          onClick={() => navigate(`/families/${fam.familyId}`)}
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted">Nenhuma família em espera prolongada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <button
                className="btn btn-link text-decoration-none p-0 fw-600"
                style={{ color: 'var(--primary)', fontSize: '13px' }}
                onClick={() => navigate('/families')}
              >
                Ver todas as famílias <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions (Preserved) */}
        <div className="col-12 col-xl-4">
          <div className="card h-100">
            <div className="card-header-custom">
              <div className="card-title">Ações Rápidas</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px 24px' }}>
              {[
                { label: 'Nova Família', icon: <FiUserPlus />, bg: '#eef2ff', color: '#4f46e5', onClick: () => setShowFamilyModal(true) },
                { label: 'Registrar Doação', icon: <FiGift />, bg: '#d1fae5', color: '#10b981', onClick: () => setShowDonationModal(true) },
                { label: 'Registrar Entrega', icon: <FiTruck />, bg: '#fef3c7', color: '#f59e0b', onClick: () => navigate('/deliveries/create') },
                { label: 'Adicionar Item', icon: <FiBox />, bg: '#dbeafe', color: '#3b82f6', onClick: () => setShowItemModal(true) },
              ].map((act, i) => (
                <div key={i}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '18px 12px',
                    background: 'var(--body-bg)', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="quick-action-hover"
                  onClick={act.onClick}
                >
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '20px', background: act.bg, color: act.color
                  }}>{act.icon}</div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', textAlign: 'center' }}>{act.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Batches Table */}
      <div className="row g-3">
        <div className="col-12">
          <div className="card">
            <div className="card-header-custom">
              <div>
                <div className="card-title">Itens Próximos ao Vencimento</div>
                <div className="card-subtitle">Lotes com validade em até 60 dias</div>
              </div>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Validade</th>
                    <th>Dias Restantes</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringBatches.length > 0 ? expiringBatches.map((batch) => (
                    <tr key={batch.batchId}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <FiBox className="text-muted" />
                          <strong>{batch.itemName}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          <FiLayers className="me-1" /> {batch.categoryName}
                        </span>
                      </td>
                      <td>{batch.quantity} unidades</td>
                      <td style={{ 
                        color: batch.daysUntilExpiration < 15 ? '#eab308' : 'inherit',
                        fontWeight: batch.daysUntilExpiration < 15 ? 600 : 400
                      }}>
                        {formatDateBR(batch.expirationDate)}
                      </td>
                      <td>{batch.daysUntilExpiration} dias</td>
                      <td>
                        <button
                          className="btn-icon-sm text-primary"
                          title="Ver detalhes"
                          onClick={() => navigate(`/items/${batch.itemId}`)}
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">Nenhum item próximo ao vencimento.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stat-total-label {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-left: 4px;
        }
        .bg-danger-soft { background-color: #fee2e2; }
        .bg-warning-soft { background-color: #fef3c7; }
        .bg-info-soft { background-color: #e0f2fe; }
        .card-body .recharts-legend-wrapper {
            font-size: 12px;
            font-weight: 500;
        }
      `}</style>

      {/* Modals */}
      <FamilyCreateModal
        show={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
        onSave={handleCreateFamily}
        loading={saving}
      />

      <DonationCreateModal
        show={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSave={handleCreateDonation}
        loading={saving}
      />

      <ItemCreateModal
        show={showItemModal}
        onClose={() => setShowItemModal(false)}
        onSave={handleCreateItem}
        loading={saving}
      />
    </div>
  );
};

export default DashboardPage;
