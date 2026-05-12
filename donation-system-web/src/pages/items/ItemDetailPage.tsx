import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteItem, getItemById, updateItem } from '../../features/items/itemService';
import { getInventoryBatchesByItem, updateInventoryBatch } from '../../features/inventoryBatches/inventoryBatchService';
import type { ItemResponse } from '../../types/item';
import type { InventoryBatchResponse, UpdateInventoryBatchRequest } from '../../types/inventoryBatch';
import InventoryBatchTable from '../../features/inventoryBatches/components/InventoryBatchTable';
import ItemEditModal from '../../features/items/components/ItemEditModal';
import InventoryBatchEditModal from '../../features/inventoryBatches/components/InventoryBatchEditModal';
import { FiEdit3, FiArrowLeft, FiBox, FiTag, FiLayers, FiActivity, FiSlash, FiCheckCircle, FiRefreshCw, FiGrid } from 'react-icons/fi';
import { notificationService } from '../../utils/toastUtils';

const ItemDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<ItemResponse | null>(null);
    const [batches, setBatches] = useState<InventoryBatchResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBatchEditModal, setShowBatchEditModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<InventoryBatchResponse | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getItemAndBatchesData();
    }, [id]);

    async function getItemAndBatchesData() {
        setLoading(true);
        setError(false);
        try {
            const itemData = await getItemById(id!);
            setItem(itemData);
            const batchData = await getInventoryBatchesByItem(id!);
            setBatches(batchData);
        } catch (err) {
            setError(true);
            notificationService.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveEdit(data: any) {
        setSaving(true);
        try {
            await updateItem(id!, data);
            notificationService.success('Item atualizado com sucesso!');
            setItem({ ...item!, ...data });
            setShowEditModal(false);
        } catch (err) {
            notificationService.error(err);
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveBatchEdit(data: UpdateInventoryBatchRequest) {
        if (!selectedBatch) return;
        setSaving(true);
        try {
            await updateInventoryBatch(selectedBatch.id, data);
            notificationService.success('Lote atualizado com sucesso!');
            await getItemAndBatchesData();
            setShowBatchEditModal(false);
        } catch (err) {
            notificationService.error(err);
        } finally {
            setSaving(false);
        }
    }

    const handleEditBatch = (batch: InventoryBatchResponse) => {
        setSelectedBatch(batch);
        setShowBatchEditModal(true);
    };

    const handleToggleStatus = async () => {
        if (!item) return;
        const action = item.active ? 'inativar' : 'ativar';
        const actionText = item.active ? 'inativado' : 'ativado';
        
        if (window.confirm(`Deseja realmente ${action} o item "${item.name}"?`)) {
            setSaving(true);
            try {
                await deleteItem(item.id);
                notificationService.success(`Item ${actionText} com sucesso!`);
                await getItemAndBatchesData();
            } catch (err) {
                notificationService.error(err);
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading && !item) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (error || !item) {
        navigate('/items');
        return null;
    }

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header da Página de Detalhes */}
            <div className="page-header mb-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{item.name}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                            <li className="breadcrumb-item">Controle de Itens</li>
                            <li className="breadcrumb-item active">{item.brand}</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-ghost" onClick={() => navigate('/items')} disabled={saving}>
                        <FiArrowLeft /> Voltar
                    </button>
                    <button className="btn-ghost" onClick={getItemAndBatchesData} disabled={loading || saving} title="Atualizar dados">
                        <FiRefreshCw className={loading ? 'spinner-border-sm' : ''} />
                    </button>
                    <button className="btn-primary-custom" onClick={() => setShowEditModal(true)} disabled={saving}>
                        <FiEdit3 /> Editar
                    </button>
                    <button 
                        className="btn-primary-custom"
                        style={{ background: item.active ? 'var(--danger)' : 'var(--success)', border: 'none' }}
                        onClick={handleToggleStatus}
                        disabled={saving}
                    >
                        {item.active ? <><FiSlash /> Inativar</> : <><FiCheckCircle /> Ativar</>}
                    </button>
                </div>
            </div>

            {/* Informações Principais */}
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon info"><FiLayers /></div>
                        <div className="stat-body">
                            <div className="stat-label">Quantidade Total</div>
                            <div className="stat-value">{item.totalQuantity}</div>
                            <div className="stat-trend neutral">Unidades disponíveis</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon warning"><FiBox /></div>
                        <div className="stat-body">
                            <div className="stat-label">Medidas e Peso</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>
                                {item.packageQuantity} {item.unitOfMeasure}
                            </div>
                            <div className="stat-trend neutral">Ref: {item.templateWeight}</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon primary"><FiTag /></div>
                        <div className="stat-body">
                            <div className="stat-label">Categoria</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{item.categoryName}</div>
                            <div className="stat-trend neutral">{item.itemTemplateName}</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className={`stat-icon ${item.active ? 'success' : 'danger'}`}>
                            <FiActivity />
                        </div>
                        <div className="stat-body">
                            <div className="stat-label">Status Atual</div>
                            <div className={`stat-value ${item.active ? 'text-success' : 'text-danger'}`} style={{ fontSize: '20px' }}>
                                {item.active ? 'Ativo' : 'Inativo'}
                            </div>
                            <div className="stat-trend neutral">Situação no sistema</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Descrição e Notas */}
            {item.notes && (
                <div className="card border-0 shadow-sm p-4">
                    <div className="card-title mb-3">Observações do Item</div>
                    <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>{item.notes}</p>
                </div>
            )}

            {/* Tabela de Lotes */}
            <div className="card h-100">
                <div className="card-header-custom border-0 pb-3">
                    <div>
                        <div className="card-title">Lotes em Estoque</div>
                        <div className="card-subtitle">Detalhamento por data de validade e entrada</div>
                    </div>
                </div>
                <InventoryBatchTable batches={batches} onEdit={handleEditBatch} />
            </div>

            <ItemEditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveEdit}
                loading={saving}
                initialData={item}
            />

            <InventoryBatchEditModal
                show={showBatchEditModal}
                onClose={() => setShowBatchEditModal(false)}
                onSave={handleSaveBatchEdit}
                loading={saving}
                batch={selectedBatch}
            />
        </div>
    );
};

export default ItemDetailPage;
