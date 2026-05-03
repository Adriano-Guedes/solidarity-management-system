import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDonationById } from '../../features/donations/donationService';
import { getAllItems } from '../../features/items/itemService';
import type { DonationResponse } from '../../types/donation';
import type { ItemResponse } from '../../types/item';
import { FiArrowLeft, FiCalendar, FiUser, FiPackage, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { formatDateBR } from '../../utils/dateFormat';
import { notificationService } from '../../utils/toastUtils';

const DonationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [donation, setDonation] = useState<DonationResponse | null>(null);
    const [itemsMap, setItemsMap] = useState<Record<string, ItemResponse>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        getDonationData();
    }, [id]);

    async function getDonationData() {
        setLoading(true);
        setError(false);
        try {
            const [donationData, allItems] = await Promise.all([
                getDonationById(id!),
                getAllItems()
            ]);
            
            const map: Record<string, ItemResponse> = {};
            allItems.forEach(item => {
                map[item.id] = item;
            });
            
            setItemsMap(map);
            setDonation(donationData);
        } catch (err) {
            setError(true);
            notificationService.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading && !donation) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (error || !donation) {
        navigate('/donations');
        return null;
    }

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header da Página de Detalhes */}
            <div className="page-header mb-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Detalhes da Doação</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                            <li className="breadcrumb-item">Gestão de Doações</li>
                            <li className="breadcrumb-item active">{formatDateBR(donation.receivedDate)}</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-ghost" onClick={() => navigate('/donations')}>
                        <FiArrowLeft /> Voltar
                    </button>
                    <button className="btn-ghost" onClick={getDonationData} disabled={loading}>
                        <FiRefreshCw className={loading ? 'spinner-border-sm' : ''} />
                    </button>
                </div>
            </div>

            {/* Informações Principais */}
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="stat-card">
                        <div className="stat-icon primary"><FiCalendar /></div>
                        <div className="stat-body">
                            <div className="stat-label">Data de Recebimento</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{formatDateBR(donation.receivedDate)}</div>
                            <div className="stat-trend neutral">Data informada na entrega</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="stat-card">
                        <div className="stat-icon info"><FiUser /></div>
                        <div className="stat-body">
                            <div className="stat-label">Responsável</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{donation.createdByName}</div>
                            <div className="stat-trend neutral">Usuário que registrou</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="stat-card">
                        <div className="stat-icon warning"><FiPackage /></div>
                        <div className="stat-body">
                            <div className="stat-label">Total de Itens</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>
                                {donation.items.reduce((acc, curr) => acc + curr.quantity, 0)} unidades
                            </div>
                            <div className="stat-trend neutral">{donation.items.length} tipos de itens</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Observações */}
            <div className="card border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-2 card-title mb-3">
                    <FiInfo className="text-primary" /> 
                    <span>Observações / Notas</span>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {donation.notes || 'Nenhuma observação informada para esta doação.'}
                </p>
            </div>

            {/* Tabela de Itens */}
            <div className="card h-100">
                <div className="card-header-custom border-0 pb-3">
                    <div>
                        <div className="card-title">Itens Doados</div>
                        <div className="card-subtitle">Relação de produtos e quantidades desta entrada</div>
                    </div>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantidade</th>
                                <th>Marca</th>
                                <th>Categoria</th>
                                <th>Validade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donation.items.map((item, index) => {
                                const itemDetail = itemsMap[item.itemId];
                                return (
                                    <tr key={index}>
                                        <td>
                                            <strong>{itemDetail?.name || 'Item não encontrado'}</strong>
                                        </td>
                                        <td>
                                            <span className="badge-status badge-delivered" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                                {item.quantity} unidades
                                            </span>
                                        </td>
                                        <td className="td-muted">{itemDetail?.brand || '-'}</td>
                                        <td>
                                            <span className="category-pill">
                                                {itemDetail?.categoryName || '-'}
                                            </span>
                                        </td>
                                        <td className="td-muted">
                                            {item.expirationDate ? formatDateBR(item.expirationDate) : 'N/A'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DonationDetailPage;
