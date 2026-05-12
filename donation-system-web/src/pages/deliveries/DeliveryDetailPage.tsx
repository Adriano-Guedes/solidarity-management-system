import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDeliveryById } from '../../features/deliveries/deliveryService';
import type { DeliveryResponse } from '../../types/delivery';
import { FiArrowLeft, FiCalendar, FiUser, FiPackage, FiInfo, FiRefreshCw, FiUsers } from 'react-icons/fi';
import { formatDateBR } from '../../utils/dateFormat';
import { notificationService } from '../../utils/toastUtils';

const DeliveryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [delivery, setDelivery] = useState<DeliveryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        getDeliveryData();
    }, [id]);

    async function getDeliveryData() {
        if (!id) return;
        setLoading(true);
        setError(false);
        try {
            const deliveryData = await getDeliveryById(id);
            setDelivery(deliveryData);
        } catch (err) {
            setError(true);
            notificationService.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading && !delivery) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (error || !delivery) {
        navigate('/deliveries');
        return null;
    }

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header */}
            <div className="page-header mb-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Detalhes da Entrega</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                            <li className="breadcrumb-item">Gestão de Entregas</li>
                            <li className="breadcrumb-item active">{formatDateBR(delivery.deliveryDate)}</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-ghost" onClick={() => navigate('/deliveries')}>
                        <FiArrowLeft /> Voltar
                    </button>
                    <button className="btn-ghost" onClick={getDeliveryData} disabled={loading}>
                        <FiRefreshCw className={loading ? 'spinner-border-sm' : ''} />
                    </button>
                </div>
            </div>

            {/* Stats / Info Cards */}
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon primary"><FiCalendar /></div>
                        <div className="stat-body">
                            <div className="stat-label">Data da Entrega</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{formatDateBR(delivery.deliveryDate)}</div>
                            <div className="stat-trend neutral">Data do atendimento</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon success"><FiUsers /></div>
                        <div className="stat-body">
                            <div className="stat-label">Família Atendida</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{delivery.familyResponsibleName}</div>
                            <div className="stat-trend neutral" onClick={() => navigate(`/families/${delivery.familyId}`)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                                Ver cadastro da família
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon info"><FiUser /></div>
                        <div className="stat-body">
                            <div className="stat-label">Registrado por</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{delivery.createdByName}</div>
                            <div className="stat-trend neutral">Usuário responsável</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon warning"><FiPackage /></div>
                        <div className="stat-body">
                            <div className="stat-label">Total de Itens</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>
                                {delivery.items.reduce((acc, curr) => acc + curr.totalQuantity, 0)} unidades
                            </div>
                            <div className="stat-trend neutral">{delivery.items.length} tipos de itens</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="card border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-2 card-title mb-3">
                    <FiInfo className="text-primary" /> 
                    <span>Observações / Notas</span>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {delivery.notes || 'Nenhuma observação informada para esta entrega.'}
                </p>
            </div>

            {/* Items Table */}
            <div className="card h-100">
                <div className="card-header-custom border-0 pb-3">
                    <div>
                        <div className="card-title">Itens Entregues</div>
                        <div className="card-subtitle">Relação de produtos e quantidades fornecidas à família</div>
                    </div>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th className="text-start">Lotes Utilizados</th>
                                <th className="text-start">Quantidade Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {delivery.items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div><strong>{item.itemName}</strong></div>
                                        <div className="mt-1">
                                            <span className="category-pill" style={{ fontSize: '10px', padding: '2px 8px' }}>
                                                {item.itemCategoryName}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        {item.batches && item.batches.length > 0 ? (
                                            <ul className="list-unstyled mb-0">
                                                {item.batches.map((batch, bIdx) => (
                                                    <li key={bIdx} className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }}></div>
                                                        <span><strong>{batch.quantity}</strong> un.</span>
                                                        <span className="mx-1">•</span>
                                                        <span>Val: {batch.expirationDate ? formatDateBR(batch.expirationDate) : 'S/ Validade'}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-muted" style={{ fontSize: '12px' }}>Nenhum lote detalhado</span>
                                        )}
                                    </td>
                                    <td className="text-start">
                                        <span className="badge-status badge-delivered" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                            {item.totalQuantity} unidades
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {delivery.items.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-muted">
                                        Nenhum item registrado nesta entrega.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDetailPage;
