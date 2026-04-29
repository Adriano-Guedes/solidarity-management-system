import React, { useEffect, useState } from 'react';
import RefreshBar from '../components/RefreshBar';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteItem, getItemById, updateItem } from '../features/items/itemService';
import { getInventoryBatchesByItem } from '../features/inventoryBatches/inventoryBatchService';
import type { ItemResponse } from '../types/item';
import type { InventoryBatchResponse } from '../types/inventoryBatch';
import InventoryBatchTable from '../features/inventoryBatches/components/InventoryBatchTable.tsx';
import Sidebar from '../components/Sidebar';
import { COLORS } from '../constants';
import RoundedButton from '../components/RoundedButton.tsx';
import LoadingModal from '../components/LoadingModal.tsx';
import ItemEditModal from '../features/items/components/ItemEditModal';

const ItemDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<ItemResponse | null>(null);
    const [batches, setBatches] = useState<InventoryBatchResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await getItemAndBatchesData();
        }
        fetchData();
    }, [id]);

    const handleRefresh = async () => {
        if (id) {
            await getItemAndBatchesData();
        }
    };

    async function getItemAndBatchesData() {
        setLoading(true);
        try {
            const itemData = await getItemById(id!);
            setItem(itemData);
            const batchData = await getInventoryBatchesByItem(id!);
            setBatches(batchData);
        } catch {
            setError('Erro ao buscar dados do item ou lotes');
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveEdit(data: any) {
        setSaving(true);
        try {
            await updateItem(id!, data);
            setItem({ ...item!, ...data });
            setShowEditModal(false);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        setSaving(true);
        try {
            await deleteItem(id!);
            await handleRefresh();
            setShowEditModal(false);
        } finally {
            setSaving(false);
        }
    }

    function countTotalAvailableQuantity() {
        return batches.reduce((total, batch) => total + batch.quantityAvailable, 0);
    }

    if (loading) return <LoadingModal show={loading} />;
    if (error || !item) {
        navigate('/items');
        return null;
    }

    return (
        <div style={{ display: 'flex', background: COLORS.background, minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: COLORS.background }}>
                <div style={{ width: '100%', padding: 40 }}>
                    {/* Card com dados do item */}
                    <div
                        style={{
                            background: COLORS.white,
                            borderRadius: 18,
                            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                            padding: 32,
                            maxWidth: 800,
                            marginBottom: 32,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            position: 'relative',
                        }}
                    >
                        {/* Topo: nome e marca */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                            <div>
                                <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.primary, lineHeight: 1 }}>{item.name}</div>
                                <div style={{ fontSize: 16, color: COLORS.secondary, fontWeight: 500, marginTop: 2 }}>{item.brand}</div>
                            </div>
                            {/* Botões de ação */}
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
                                <RoundedButton color={COLORS.white} background={COLORS.primary} onClick={() => setShowEditModal(true)}>Editar</RoundedButton>
                                <RoundedButton color={item.active ? COLORS.white : COLORS.white} background={item.active ? COLORS.danger : COLORS.success} onClick={() => handleDelete(item.id)}>{item.active ? 'Inativar' : 'Ativar'}</RoundedButton>
                            </div>
                        </div>
                        {/* Descrição centralizada */}
                        <div style={{ textAlign: 'center', color: COLORS.textSecondary || '#64748B', margin: '18px 0 28px 0', fontSize: 16, minHeight: 24 }}>
                            {item.notes}
                        </div>
                        {/* Cards menores de info */}
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 0 }}>
                            <div style={{ background: COLORS.background, borderRadius: 12, padding: '16px 24px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ fontSize: 13, color: COLORS.textSecondary || '#64748B', fontWeight: 500, marginBottom: 2 }}>Quantidade Total</div>
                                <div style={{ fontSize: 20, color: COLORS.primary, fontWeight: 700 }}>{countTotalAvailableQuantity()}</div>
                            </div>
                            <div style={{ background: COLORS.background, borderRadius: 12, padding: '16px 24px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ fontSize: 13, color: COLORS.textSecondary || '#64748B', fontWeight: 500, marginBottom: 2 }}>Medida</div>
                                <div style={{ fontSize: 20, color: COLORS.primary, fontWeight: 700 }}>{item.packageQuantity} {item.unitOfMeasure}</div>
                            </div>
                            <div style={{ background: COLORS.background, borderRadius: 12, padding: '16px 24px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ fontSize: 13, color: COLORS.textSecondary || '#64748B', fontWeight: 500, marginBottom: 2 }}>Categoria</div>
                                <div style={{ fontSize: 20, color: COLORS.primary, fontWeight: 700 }}>{item.categoryName}</div>
                            </div>
                            <div style={{ background: COLORS.background, borderRadius: 12, padding: '16px 24px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ fontSize: 13, color: COLORS.textSecondary || '#64748B', fontWeight: 500, marginBottom: 2 }}>Modelo Base</div>
                                <div style={{ fontSize: 20, color: COLORS.primary, fontWeight: 700 }}>{item.itemTemplateName}</div>
                            </div>
                            <div style={{ background: COLORS.background, borderRadius: 12, padding: '16px 24px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ fontSize: 13, color: COLORS.textSecondary || '#64748B', fontWeight: 500, marginBottom: 2 }}>Status</div>
                                <div style={{ fontSize: 20, color: COLORS.primary, fontWeight: 700 }}>{item.active ? 'Ativo' : 'Inativo'}</div>
                            </div>
                        </div>
                    </div>
                    {/* Abas Bootstrap */}
                    {/* <Tab.Container defaultActiveKey="batches">
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="batches">Lotes</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="batches">
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container> */}
                    <RefreshBar onRefresh={handleRefresh} loading={loading} onBack={() => navigate('/items')} />
                    <InventoryBatchTable batches={batches} />
                </div>
            </main>
            <ItemEditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveEdit}
                loading={saving}
                initialData={item}
            />
        </div>
    );
};

export default ItemDetailPage;
