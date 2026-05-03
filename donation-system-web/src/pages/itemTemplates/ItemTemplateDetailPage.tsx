import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEdit3, FiArrowLeft, FiTag, FiLayers, FiActivity, FiSlash, FiCheckCircle, FiRefreshCw, FiInfo, FiThermometer, FiAlertTriangle } from 'react-icons/fi';
import { getItemTemplateById, deleteItemTemplate, updateItemTemplate } from '../../features/itemTemplates/itemTemplateService';
import type { ItemTemplateResponse, UpdateItemTemplateRequest } from '../../types/itemTemplate';
import { notificationService } from '../../utils/toastUtils';
import ItemTemplateEditModal from '../../features/itemTemplates/components/ItemTemplateEditModal';

const ItemTemplateDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [template, setTemplate] = useState<ItemTemplateResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) fetchTemplate();
    }, [id]);

    const fetchTemplate = async () => {
        setLoading(true);
        try {
            if (id) {
                const data = await getItemTemplateById(id);
                setTemplate(data);
            }
        } catch (err) {
            notificationService.error(err);
            navigate('/item-templates');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async () => {
        if (!template) return;
        const action = template.active ? 'inativar' : 'ativar';
        if (window.confirm(`Deseja realmente ${action} este modelo?`)) {
            try {
                await deleteItemTemplate(template.id);
                notificationService.success(`Modelo ${template.active ? 'inativado' : 'ativado'} com sucesso!`);
                fetchTemplate();
            } catch (err) {
                notificationService.error(err);
            }
        }
    };

    const handleSaveUpdate = async (id: string, data: UpdateItemTemplateRequest) => {
        setSaving(true);
        try {
            await updateItemTemplate(id, data);
            notificationService.success('Modelo atualizado com sucesso!');
            setShowEditModal(false);
            fetchTemplate();
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

    if (!template) return null;

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header */}
            <div className="page-header mb-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{template.name}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                            <li className="breadcrumb-item">Estoque</li>
                            <li className="breadcrumb-item"><a href="/item-templates" style={{ textDecoration: 'none', color: 'inherit' }}>Modelos de Itens</a></li>
                            <li className="breadcrumb-item active">{template.name}</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-ghost" onClick={() => navigate('/item-templates')}>
                        <FiArrowLeft /> Voltar
                    </button>
                    <button className={`btn-ghost ${template.active ? 'text-danger' : 'text-success'}`} onClick={handleToggleActive}>
                        {template.active ? <><FiSlash /> Inativar</> : <><FiCheckCircle /> Ativar</>}
                    </button>
                    <button className="btn-primary-custom" onClick={() => setShowEditModal(true)}>
                        <FiEdit3 /> Editar
                    </button>
                </div>
            </div>

            {/* Informações Principais */}
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon primary"><FiTag /></div>
                        <div className="stat-body">
                            <div className="stat-label">Categoria</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{template.categoryName}</div>
                            <div className="stat-trend neutral">Classificação do item</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon warning"><FiLayers /></div>
                        <div className="stat-body">
                            <div className="stat-label">Grupo de Necessidade</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{template.needGroupName}</div>
                            <div className="stat-trend neutral">Agrupamento logístico</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon info"><FiActivity /></div>
                        <div className="stat-body">
                            <div className="stat-label">Status</div>
                            <div className={`stat-value ${template.active ? 'text-success' : 'text-danger'}`} style={{ fontSize: '18px' }}>
                                {template.active ? 'Ativo' : 'Inativo'}
                            </div>
                            <div className="stat-trend neutral">Situação no sistema</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon secondary"><FiInfo /></div>
                        <div className="stat-body">
                            <div className="stat-label">Unidade Padrão</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>{template.defaultUnitOfMeasure || 'N/A'}</div>
                            <div className="stat-trend neutral">Medida base sugerida</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalhes e Características */}
            <div className="row g-4">
                <div className="col-12 col-xl-8">
                    <div className="card border-0 shadow-sm p-4">
                        <h6 className="fw-bold mb-4">Características do Modelo</h6>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light h-100">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${template.isPerishable ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`} style={{ width: '48px', height: '48px' }}>
                                        <FiAlertTriangle size={22} />
                                    </div>
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: '14px' }}>Perecibilidade</div>
                                        <div className="text-muted" style={{ fontSize: '12px' }}>
                                            {template.isPerishable ? 'Item perecível (requer atenção à validade)' : 'Item não perecível'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light h-100">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${template.requiresRefrigeration ? 'bg-info-subtle text-info' : 'bg-secondary-subtle text-secondary'}`} style={{ width: '48px', height: '48px' }}>
                                        <FiThermometer size={22} />
                                    </div>
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: '14px' }}>Refrigeração</div>
                                        <div className="text-muted" style={{ fontSize: '12px' }}>
                                            {template.requiresRefrigeration ? 'Requer armazenamento refrigerado' : 'Temperatura ambiente'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light h-100">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${template.suitableForAutoSuggestion ? 'bg-primary-subtle text-primary' : 'bg-secondary-subtle text-secondary'}`} style={{ width: '48px', height: '48px' }}>
                                        <FiCheckCircle size={22} />
                                    </div>
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: '14px' }}>Sugestão Automática</div>
                                        <div className="text-muted" style={{ fontSize: '12px' }}>
                                            {template.suitableForAutoSuggestion ? 'Habilitado para cálculos do sistema' : 'Ignorado em sugestões'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light h-100">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${template.requiresManualAnalysis ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'}`} style={{ width: '48px', height: '48px' }}>
                                        <FiActivity size={22} />
                                    </div>
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: '14px' }}>Análise Manual</div>
                                        <div className="text-muted" style={{ fontSize: '12px' }}>
                                            {template.requiresManualAnalysis ? 'Sempre requer revisão humana' : 'Fluxo automático padrão'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h6 className="fw-bold mb-3">Observações Adicionais</h6>
                            <div className="p-3 rounded-3 border bg-white text-muted" style={{ minHeight: '100px', fontSize: '14px' }}>
                                {template.notes || 'Nenhuma observação cadastrada para este modelo.'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    <div className="card border-0 shadow-sm p-4">
                        <h6 className="fw-bold mb-4">Informações de Auditoria</h6>
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between border-bottom pb-2">
                                <span className="text-muted" style={{ fontSize: '13px' }}>Data de Criação</span>
                                <span style={{ fontSize: '13px' }}>{new Date(template.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="d-flex justify-content-between border-bottom pb-2">
                                <span className="text-muted" style={{ fontSize: '13px' }}>Última Atualização</span>
                                <span style={{ fontSize: '13px' }}>{template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : 'Nunca'}</span>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-3 bg-light">
                            <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                                <FiRefreshCw size={14} />
                                <span className="fw-bold" style={{ fontSize: '13px' }}>Dica</span>
                            </div>
                            <p className="mb-0 text-muted" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                                Modelos de itens servem como base para a criação de novos itens no estoque, 
                                padronizando as regras logísticas e de perecibilidade.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ItemTemplateEditModal 
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveUpdate}
                initialData={template}
                loading={saving}
            />
        </div>
    );
};

export default ItemTemplateDetailPage;
