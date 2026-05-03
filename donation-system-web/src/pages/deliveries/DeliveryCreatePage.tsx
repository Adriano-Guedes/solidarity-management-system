import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFamiliesPriorityRanking, getFamilyDeliverySuggestion } from '../../features/families/familyService';
import { getAllActiveItems } from '../../features/items/itemService';
import { createDelivery } from '../../features/deliveries/deliveryService';
import type { FamilyPriorityListItemResponse } from '../../types/family';
import type { DeliverySuggestionResponse, CreateDeliveryRequest } from '../../types/delivery';
import type { ActiveItemResponse } from '../../types/item';
import { FiArrowLeft, FiSave, FiSearch, FiPlus, FiMinus, FiTrash2, FiAlertCircle, FiCheckCircle, FiTruck, FiInfo, FiPackage, FiActivity } from 'react-icons/fi';
import { notificationService } from '../../utils/toastUtils';

const DeliveryCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [families, setFamilies] = useState<FamilyPriorityListItemResponse[]>([]);
    const [activeItems, setActiveItems] = useState<ActiveItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
    const [familySearch, setFamilySearch] = useState('');
    const [suggestion, setSuggestion] = useState<DeliverySuggestionResponse | null>(null);
    const [suggestionLoading, setSuggestionLoading] = useState(false);

    const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [cart, setCart] = useState<{ itemId: string; quantity: number; item: ActiveItemResponse }[]>([]);

    const [itemSearch, setItemSearch] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    async function fetchInitialData() {
        setLoading(true);
        try {
            const [familiesData, itemsData] = await Promise.all([
                getFamiliesPriorityRanking(),
                getAllActiveItems()
            ]);
            setFamilies(familiesData || []);
            setActiveItems(itemsData || []);
        } catch (err) {
            notificationService.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredFamilies = useMemo(() => {
        if (!families) return [];
        return families.filter(f => 
            f.responsibleName?.toLowerCase().includes(familySearch.toLowerCase())
        );
    }, [families, familySearch]);

    const filteredItems = useMemo(() => {
        if (!activeItems) return [];
        return activeItems.filter(i => 
            i.name?.toLowerCase().includes(itemSearch.toLowerCase()) ||
            i.categoryName?.toLowerCase().includes(itemSearch.toLowerCase()) ||
            i.needGroup?.toLowerCase().includes(itemSearch.toLowerCase())
        );
    }, [activeItems, itemSearch]);

    const handleFamilyChange = async (familyId: string) => {
        setSelectedFamilyId(familyId);
        setCart([]);
        if (!familyId) {
            setSuggestion(null);
            return;
        }

        setSuggestionLoading(true);
        try {
            const data = await getFamilyDeliverySuggestion(familyId);
            setSuggestion(data);
        } catch (err) {
            notificationService.error('Erro ao buscar sugestão de entrega.');
            setSuggestion(null);
        } finally {
            setSuggestionLoading(false);
        }
    };

    const handleAddToCart = (item: ActiveItemResponse) => {
        setCart(prev => {
            const existing = prev.find(i => i.itemId === item.id);
            if (existing) {
                if (existing.quantity >= item.totalQuantity) {
                    notificationService.warning(`Quantidade máxima em estoque atingida para ${item.name}`);
                    return prev;
                }
                return prev.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { itemId: item.id, quantity: 1, item }];
        });
    };

    const handleUpdateQuantity = (itemId: string, delta: number) => {
        setCart(prev => {
            return prev.map(i => {
                if (i.itemId === itemId) {
                    const newQty = i.quantity + delta;
                    if (newQty <= 0) return i;
                    if (newQty > i.item.totalQuantity) {
                        notificationService.warning(`Quantidade máxima em estoque atingida para ${i.item.name}`);
                        return i;
                    }
                    return { ...i, quantity: newQty };
                }
                return i;
            });
        });
    };

    const handleRemoveFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i.itemId !== itemId));
    };

    const handleAddAllSuggestions = () => {
        if (!suggestion || !suggestion.suggestedItems) return;
        
        const newCart = [...cart];
        let addedCount = 0;

        for (const suggestedItem of suggestion.suggestedItems) {
            const activeItem = activeItems.find(i => i.id === suggestedItem.itemId);
            if (activeItem) {
                const existingIndex = newCart.findIndex(i => i.itemId === activeItem.id);
                const suggestedQty = suggestedItem.suggestedUnits || 0;
                
                if (existingIndex > -1) {
                    const existing = newCart[existingIndex];
                    const canAdd = Math.max(0, Math.min(suggestedQty - existing.quantity, activeItem.totalQuantity - existing.quantity));
                    if (canAdd > 0) {
                        newCart[existingIndex] = { ...existing, quantity: existing.quantity + canAdd };
                        addedCount++;
                    }
                } else {
                    const quantity = Math.min(suggestedQty, activeItem.totalQuantity);
                    if (quantity > 0) {
                        newCart.push({
                            itemId: activeItem.id,
                            quantity: quantity,
                            item: activeItem
                        });
                        addedCount++;
                    }
                }
            }
        }

        if (addedCount > 0) {
            setCart(newCart);
            notificationService.success(`${addedCount} itens das sugestões foram adicionados ou atualizados.`);
        } else {
            notificationService.warning('Todos os itens sugeridos já estão no carrinho ou sem estoque.');
        }
    };

    const handleClearCart = () => {
        if (cart.length === 0) return;
        if (window.confirm('Deseja realmente limpar todos os itens da entrega?')) {
            setCart([]);
            notificationService.success('Carrinho limpo.');
        }
    };

    const needGroupsProgress = useMemo(() => {
        if (!suggestion || !suggestion.needGroupsSummary) return [];

        return suggestion.needGroupsSummary.map(summary => {
            const metInCart = cart
                .filter(c => c.item.needGroup?.trim().toLowerCase() === summary.needGroup?.trim().toLowerCase())
                .reduce((acc, curr) => {
                    const weight = curr.item.templateWeight > 0 ? curr.item.templateWeight : (curr.item.referenceQuantity || 0);
                    return acc + (curr.quantity * weight);
                }, 0);

            const requiredQty = summary.requiredQuantity || 0;
            const percentage = requiredQty > 0 
                ? Math.min((metInCart / requiredQty) * 100, 100) 
                : 100;

            return {
                ...summary,
                metInCart,
                percentage,
                fullyMet: metInCart >= requiredQty
            };
        });
    }, [suggestion, cart]);

    const isAllGroupsMet = useMemo(() => {
        if (!suggestion) return true;
        if (needGroupsProgress.length === 0) return true;
        return needGroupsProgress.every(p => p.fullyMet);
    }, [needGroupsProgress, suggestion]);

    const handleSave = async () => {
        if (!selectedFamilyId) {
            notificationService.warning('Selecione uma família.');
            return;
        }
        if (cart.length === 0) {
            notificationService.warning('Adicione pelo menos um item à entrega.');
            return;
        }

        const request: CreateDeliveryRequest = {
            familyId: selectedFamilyId,
            deliveryDate,
            notes,
            items: cart.map(c => ({
                itemId: c.itemId,
                quantity: c.quantity
            }))
        };

        setSaving(true);
        try {
            await createDelivery(request);
            notificationService.success('Entrega registrada com sucesso!');
            navigate('/deliveries');
        } catch (err) {
            notificationService.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header */}
            <div className="page-header mb-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Nova Entrega</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                            <li className="breadcrumb-item">Logística de Entregas</li>
                            <li className="breadcrumb-item active">Nova Entrega</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-ghost" onClick={() => navigate('/deliveries')}>
                        <FiArrowLeft /> Voltar
                    </button>
                    <button className="btn-primary-custom" style={{ background: 'var(--success)', border: 'none' }} onClick={handleSave} disabled={saving}>
                        <FiSave /> Salvar Entrega
                    </button>
                </div>
            </div>

            {/* Row 1: Basic Info and Need Groups */}
            <div className="row g-4">
                <div className="col-12 col-xl-7">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="card-title mb-4">Informações Básicas</div>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label text-muted" style={{ fontSize: '13px', fontWeight: 600 }}>Família Beneficiária</label>
                                <div className="input-group mb-2">
                                    <span className="input-group-text bg-white border-end-0"><FiSearch className="text-muted" size={14} /></span>
                                    <input 
                                        type="text" 
                                        className="form-control border-start-0" 
                                        placeholder="Pesquisar família por nome..." 
                                        value={familySearch}
                                        onChange={(e) => setFamilySearch(e.target.value)}
                                        style={{ fontSize: '14px' }}
                                    />
                                </div>
                                <select 
                                    className="form-select" 
                                    value={selectedFamilyId} 
                                    onChange={(e) => handleFamilyChange(e.target.value)}
                                    style={{ borderRadius: '8px', padding: '10px' }}
                                >
                                    <option value="">Selecione uma família...</option>
                                    {filteredFamilies.map(f => (
                                        <option key={f.familyId} value={f.familyId}>
                                            {f.responsibleName} (Prioridade: {f.priorityLevel})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted" style={{ fontSize: '13px', fontWeight: 600 }}>Data da Entrega</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={deliveryDate} 
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    style={{ borderRadius: '8px', padding: '10px' }}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label text-muted" style={{ fontSize: '13px', fontWeight: 600 }}>Observações</label>
                                <textarea 
                                    className="form-control" 
                                    rows={2} 
                                    placeholder="Notas adicionais sobre esta entrega..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <FiActivity className="text-primary" />
                                <span className="fw-bold">Grupos de Necessidade</span>
                            </div>
                            {suggestion && (
                                <>
                                    {!isAllGroupsMet && (
                                        <div className="text-danger d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                                            <FiAlertCircle /> Pendente
                                        </div>
                                    )}
                                    {isAllGroupsMet && (
                                        <div className="text-success d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                                            <FiCheckCircle /> Atendido
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {suggestionLoading ? (
                            <div className="d-flex justify-content-center p-4">
                                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                            </div>
                        ) : suggestion ? (
                            <div className="d-flex flex-column gap-3">
                                {needGroupsProgress.length > 0 ? (
                                    needGroupsProgress.map((group, idx) => (
                                        <div key={idx}>
                                            <div className="d-flex justify-content-between mb-1" style={{ fontSize: '12px' }}>
                                                <span>{group.needGroup}</span>
                                                <span className={group.fullyMet ? 'text-success fw-bold' : 'text-muted'}>
                                                    {(group.metInCart || 0).toFixed(1)} / {(group.requiredQuantity || 0).toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                                <div 
                                                    className={`progress-bar ${group.fullyMet ? 'bg-success' : 'bg-primary'}`} 
                                                    role="progressbar" 
                                                    style={{ width: `${group.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted" style={{ fontSize: '13px' }}>
                                        Não foram definidos grupos para esta sugestão.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-muted" style={{ fontSize: '13px' }}>
                                Selecione uma família para visualizar o progresso das necessidades.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 2: Suggestions, Available Items and Cart */}
            <div className="row g-4">
                {/* Suggestions */}
                <div className="col-12 col-xl-3">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <FiPackage className="text-primary" />
                                <span className="fw-bold">Sugestões</span>
                            </div>
                            {suggestion && suggestion.suggestedItems && suggestion.suggestedItems.length > 0 && (
                                <button 
                                    className="btn btn-sm btn-outline-primary py-1 px-2" 
                                    style={{ fontSize: '11px', borderRadius: '6px' }}
                                    onClick={handleAddAllSuggestions}
                                    disabled={suggestionLoading}
                                >
                                    Adicionar todos
                                </button>
                            )}                        </div>
                        
                        {suggestionLoading ? (
                            <div className="d-flex justify-content-center p-4">
                                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                            </div>
                        ) : suggestion ? (
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex flex-column gap-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {suggestion.suggestedItems && suggestion.suggestedItems.length > 0 ? (
                                        suggestion.suggestedItems.map((suggestedItem, idx) => {
                                            const activeItem = activeItems.find(i => i.id === suggestedItem.itemId);
                                            return (
                                                <div key={idx} className="p-2 border rounded-3" style={{ fontSize: '12px' }}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex justify-content-between pe-2">
                                                                <strong>{suggestedItem.itemName}</strong>
                                                                <span className="badge bg-light text-dark">{suggestedItem.suggestedUnits} un.</span>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            className="btn-icon-sm ms-1" 
                                                            style={{ width: '24px', height: '24px' }}
                                                            onClick={() => activeItem && handleAddToCart(activeItem)}
                                                            disabled={!activeItem || activeItem.totalQuantity <= 0}
                                                        >
                                                            <FiPlus size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-4 text-muted" style={{ fontSize: '12px' }}>
                                            Sem sugestões.
                                        </div>
                                    )}
                                </div>

                                {suggestion.reasons && suggestion.reasons.length > 0 && (
                                    <div className="mt-2 p-2 bg-light rounded-3">
                                        <div className="d-flex align-items-center gap-1 mb-1 text-primary" style={{ fontSize: '11px', fontWeight: 600 }}>
                                            <FiInfo size={12} /> Motivos
                                        </div>
                                        <ul className="mb-0 ps-3 text-muted" style={{ fontSize: '10px' }}>
                                            {suggestion.reasons.map((reason, idx) => (
                                                <li key={idx} className="mb-1">{reason}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-muted" style={{ fontSize: '12px' }}>
                                Selecione uma família.
                            </div>
                        )}
                    </div>
                </div>

                {/* Available Items */}
                <div className="col-12 col-xl-5">
                    <div className="card border-0 shadow-sm overflow-hidden h-100">
                        <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                            <div className="fw-bold">Itens Disponíveis</div>
                            <div className="input-group input-group-sm" style={{ width: '180px' }}>
                                <span className="input-group-text bg-white border-end-0"><FiSearch className="text-muted" /></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Filtrar..." 
                                    value={itemSearch}
                                    onChange={(e) => setItemSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="table-wrapper" style={{ maxHeight: '550px', overflowY: 'auto' }}>
                            <table style={{ fontSize: '13px' }}>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Estoque</th>
                                        <th>Grupo</th>
                                        <th className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map(item => {
                                        const inCart = cart.find(c => c.itemId === item.id);
                                        const remaining = (item.totalQuantity || 0) - (inCart?.quantity || 0);
                                        
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <strong>{item.name}</strong>
                                                        <span className="text-muted" style={{ fontSize: '10px' }}>{item.categoryName}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={remaining <= 0 ? 'text-danger fw-bold' : ''}>
                                                        {remaining}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        <span className="category-pill" style={{ fontSize: '10px', padding: '2px 8px', width: 'fit-content' }}>
                                                            {item.needGroup}
                                                        </span>
                                                        <span className="text-muted" style={{ fontSize: '10px', fontWeight: 500 }}>
                                                            {item.templateWeight} / un
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-end">
                                                    <button 
                                                        className="btn-icon-sm" 
                                                        onClick={() => handleAddToCart(item)}
                                                        disabled={remaining <= 0}
                                                    >
                                                        <FiPlus size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredItems.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4 text-muted">Nenhum item.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Cart */}
                <div className="col-12 col-xl-4">
                    <div className="card border-0 shadow-sm h-100" style={{ minHeight: '600px' }}>
                        <div className="p-4 border-bottom d-flex align-items-center gap-2">
                            <FiTruck className="text-primary" />
                            <span className="fw-bold">No Carrinho</span>
                            <span className="badge bg-primary rounded-pill ms-auto">{cart.length}</span>
                            
                            {cart.length > 0 && (
                                <button 
                                    className="btn btn-sm btn-ghost text-danger p-1 d-flex align-items-center gap-1"
                                    style={{ fontSize: '11px' }}
                                    onClick={handleClearCart}
                                >
                                    <FiTrash2 size={14} /> Limpar
                                </button>
                            )}
                        </div>
                        
                        <div className="card-body p-0 d-flex flex-column">
                            {cart.length === 0 ? (
                                <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-muted p-5 text-center">
                                    <FiPackage size={48} className="mb-3 opacity-25" />
                                    <p>Carrinho vazio.</p>
                                </div>
                            ) : (
                                <div className="flex-grow-1" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {cart.map(c => (
                                        <div key={c.itemId} className="p-3 border-bottom cart-item-row">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="d-flex flex-column">
                                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{c.item.name}</span>
                                                    <div className="d-flex gap-1 align-items-center">
                                                        <span className="text-muted" style={{ fontSize: '10px' }}>{c.item.categoryName}</span>
                                                        <span className="text-muted" style={{ fontSize: '10px' }}>• {c.item.needGroup}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="btn btn-sm text-danger p-0" 
                                                    onClick={() => handleRemoveFromCart(c.itemId)}
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center gap-2">
                                                    <button 
                                                        className="btn btn-outline-secondary btn-xs p-0 d-flex align-items-center justify-content-center" 
                                                        style={{ width: '20px', height: '20px', borderRadius: '4px' }}
                                                        onClick={() => handleUpdateQuantity(c.itemId, -1)}
                                                    >
                                                        <FiMinus size={10} />
                                                    </button>
                                                    <span className="fw-bold px-1" style={{ fontSize: '13px', minWidth: '24px', textAlign: 'center' }}>
                                                        {c.quantity}
                                                    </span>
                                                    <button 
                                                        className="btn btn-outline-secondary btn-xs p-0 d-flex align-items-center justify-content-center" 
                                                        style={{ width: '20px', height: '20px', borderRadius: '4px' }}
                                                        onClick={() => handleUpdateQuantity(c.itemId, 1)}
                                                    >
                                                        <FiPlus size={10} />
                                                    </button>
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                                    Sub: {(c.quantity * (c.item.templateWeight > 0 ? c.item.templateWeight : (c.item.referenceQuantity || 0))).toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {cart.length > 0 && (
                                <div className="p-4 bg-light mt-auto">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Total itens:</span>
                                        <span className="fw-bold">{cart.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
                                    </div>
                                    <div className="alert alert-info py-2 px-3 border-0 d-flex align-items-start gap-2" style={{ fontSize: '11px' }}>
                                        <FiInfo className="mt-1" />
                                        <div>
                                            Confira os grupos de necessidade antes de salvar.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryCreatePage;
