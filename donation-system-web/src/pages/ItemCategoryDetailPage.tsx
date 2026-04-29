import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteItemCategory, getItemCategoryById, updateItemCategory } from '../features/itemCategories/itemCategoryService';
import type { ItemCategoryResponse, UpdateItemCategoryRequest } from '../types/itemCategory';
import ItemCategoryEditModal from '../features/itemCategories/components/ItemCategoryEditModal';
import { FiEdit3, FiArrowLeft, FiTag, FiInfo, FiActivity, FiSlash, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { formatDateBR } from '../utils/dateFormat';

const ItemCategoryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<ItemCategoryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getCategoryData();
    }, [id]);

    async function getCategoryData() {
        setLoading(true);
        try {
            const data = await getItemCategoryById(id!);
            setCategory(data);
        } catch {
            setError('Erro ao buscar dados da categoria');
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveEdit(data: UpdateItemCategoryRequest) {
        setSaving(true);
        try {
            await updateItemCategory(id!, data);
            setCategory({ ...category!, ...data });
            setShowEditModal(false);
        } catch (err) {
            alert('Erro ao salvar alterações');
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    const handleToggleStatus = async () => {
        if (!category) return;
        const action = category.active ? 'inativar' : 'ativar';
        if (window.confirm(`Deseja realmente ${action} a categoria "${category.name}"?`)) {
            setSaving(true);
            try {
                await deleteItemCategory(category.id);
                await getCategoryData();
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (error || !category) {
        navigate('/item-categories');
        return null;
    }

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header da Página de Detalhes */}
            <div className="page-header mb-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{category.name}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                            <li className="breadcrumb-item">Controle de Itens</li>
                            <li className="breadcrumb-item">Categorias</li>
                            <li className="breadcrumb-item active">{category.name}</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-ghost" onClick={() => navigate('/item-categories')} disabled={saving}>
                        <FiArrowLeft /> Voltar
                    </button>
                    <button className="btn-primary-custom" onClick={() => setShowEditModal(true)} disabled={saving}>
                        <FiEdit3 /> Editar
                    </button>
                    <button 
                        className="btn-primary-custom"
                        style={{ background: category.active ? 'var(--danger)' : 'var(--success)', border: 'none' }}
                        onClick={handleToggleStatus}
                        disabled={saving}
                    >
                        {category.active ? <><FiSlash /> Inativar</> : <><FiCheckCircle /> Ativar</>}
                    </button>
                </div>
            </div>

            {/* Informações Principais */}
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="stat-card">
                        <div className="stat-icon primary"><FiTag /></div>
                        <div className="stat-body">
                            <div className="stat-label">Nome da Categoria</div>
                            <div className="stat-value" style={{ fontSize: '20px' }}>{category.name}</div>
                            <div className="stat-trend neutral">Identificador principal</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="stat-card">
                        <div className={`stat-icon ${category.active ? 'success' : 'danger'}`}>
                            <FiActivity />
                        </div>
                        <div className="stat-body">
                            <div className="stat-label">Status Atual</div>
                            <div className={`stat-value ${category.active ? 'text-success' : 'text-danger'}`} style={{ fontSize: '20px' }}>
                                {category.active ? 'Ativo' : 'Inativo'}
                            </div>
                            <div className="stat-trend neutral">Situação no sistema</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="stat-card">
                        <div className="stat-icon info"><FiCalendar /></div>
                        <div className="stat-body">
                            <div className="stat-label">Cadastrada em</div>
                            <div className="stat-value" style={{ fontSize: '20px' }}>{formatDateBR(category.createdAt)}</div>
                            <div className="stat-trend neutral">Data de criação</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Descrição */}
            <div className="card border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-2 card-title mb-3">
                    <FiInfo className="text-primary" /> 
                    <span>Descrição da Categoria</span>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {category.description || 'Nenhuma descrição informada para esta categoria.'}
                </p>
            </div>

            <ItemCategoryEditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveEdit}
                loading={saving}
                initialData={category}
            />
        </div>
    );
};

export default ItemCategoryDetailPage;