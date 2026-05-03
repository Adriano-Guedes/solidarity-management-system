import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFamilyById, updateFamily, updateFamilyStatus } from '../../features/families/familyService';
import { getFamilyMembers, updateFamilyMember, createFamilyMember, updateFamilyMemberStatus } from '../../features/familyMembers/familyMemberService';
import { getAllDeliveriesByFamilyId } from '../../features/deliveries/deliveryService';
import type { FamilyResponse, UpdateFamilyRequest } from '../../types/family';
import type { FamilyMemberResponse, UpdateFamilyMemberRequest, CreateFamilyMemberRequest } from '../../types/familyMember';
import type { DeliveryResponse } from '../../types/delivery';
import { FiArrowLeft, FiUser, FiMapPin, FiPhone, FiActivity, FiSlash, FiCheckCircle, FiEdit3, FiRefreshCw, FiUsers, FiTruck, FiEye, FiFileText, FiPlus, FiStar } from 'react-icons/fi';
import { notificationService } from '../../utils/toastUtils';
import FamilyMemberCreateModal from '../../features/familyMembers/components/FamilyMemberCreateModal';
import FamilyMemberEditModal from '../../features/familyMembers/components/FamilyMemberEditModal';
import FamilyEditModal from '../../features/families/components/FamilyEditModal';
import { formatDateBR, calculateAge } from '../../utils/dateFormat';

const FamilyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [family, setFamily] = useState<FamilyResponse | null>(null);
    const [members, setMembers] = useState<FamilyMemberResponse[]>([]);
    const [deliveries, setDeliveries] = useState<DeliveryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFamilyEditModal, setShowFamilyEditModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<FamilyMemberResponse | null>(null);

    useEffect(() => {
        getFamilyData();
    }, [id]);

    async function getFamilyData() {
        if (!id) return;
        setLoading(true);
        setError(false);
        try {
            const [familyData, membersData, allDeliveries] = await Promise.all([
                getFamilyById(id),
                getFamilyMembers(id),
                getAllDeliveriesByFamilyId(id)
            ]);
            setFamily(familyData);
            setMembers(membersData);
            setDeliveries(allDeliveries);
        } catch (err) {
            setError(true);
            notificationService.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateFamily = async (data: UpdateFamilyRequest) => {
        if (!id) return;
        setSaving(true);
        try {
            await updateFamily(id, data);
            notificationService.success('Dados da família atualizados com sucesso!');
            await getFamilyData();
            setShowFamilyEditModal(false);
        } catch (err) {
            notificationService.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleFamilyStatus = async () => {
        if (!family) return;
        const action = family.active ? 'inativar' : 'ativar';
        const actionPast = family.active ? 'inativada' : 'ativada';
        if (window.confirm(`Deseja realmente ${action} a família de "${family.responsibleName}"?`)) {
            setSaving(true);
            try {
                await updateFamilyStatus(family.id);
                notificationService.success(`Família ${actionPast} com sucesso!`);
                await getFamilyData();
            } catch (err) {
                notificationService.error(err);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleToggleMemberStatus = async (member: FamilyMemberResponse) => {
        const action = member.active ? 'inativar' : 'ativar';
        const actionPast = member.active ? 'inativado' : 'ativado';
        if (window.confirm(`Deseja realmente ${action} o membro "${member.name}"?`)) {
            setSaving(true);
            try {
                await updateFamilyMemberStatus(family!.id, member.id);
                notificationService.success(`Membro ${actionPast} com sucesso!`);
                await getFamilyData();
            } catch (err) {
                notificationService.error(err);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleCreateMember = async (data: CreateFamilyMemberRequest) => {
        if (!family) return;
        setSaving(true);
        try {
            await createFamilyMember(family.id, data);
            notificationService.success('Membro adicionado com sucesso!');
            await getFamilyData();
            setShowCreateModal(false);
        } catch (err) {
            notificationService.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateMember = async (data: UpdateFamilyMemberRequest) => {
        if (!selectedMember || !family) return;
        setSaving(true);
        try {
            await updateFamilyMember(family.id, selectedMember.id, data);
            notificationService.success('Membro atualizado com sucesso!');
            await getFamilyData();
            setShowEditModal(false);
        } catch (err) {
            notificationService.error(err);
        } finally {
            setSaving(false);
        }
    };

    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    const openEditModal = (member: FamilyMemberResponse) => {
        setSelectedMember(member);
        setShowEditModal(true);
    };

    if (loading && !family) return (
        <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (error || !family) {
        navigate('/families');
        return null;
    }

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header */}
            <div className="page-header mb-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Família de {family.responsibleName}</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                            <li className="breadcrumb-item">Gestão de Famílias</li>
                            <li className="breadcrumb-item active">{family.responsibleName}</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-ghost" onClick={() => navigate('/families')}>
                        <FiArrowLeft /> Voltar
                    </button>
                    <button className="btn-ghost" onClick={getFamilyData} disabled={loading || saving} title="Atualizar dados">
                        <FiRefreshCw className={loading ? 'spinner-border-sm' : ''} />
                    </button>
                    <button className="btn-primary-custom" onClick={() => setShowFamilyEditModal(true)} disabled={loading || saving} title="Editar dados da família">
                        <FiEdit3 /> Editar
                    </button>
                    <button
                        className="btn-primary-custom"
                        style={{ background: family.active ? 'var(--danger)' : 'var(--success)', border: 'none' }}
                        onClick={handleToggleFamilyStatus}
                        disabled={saving}
                    >
                        {family.active ? <><FiSlash /> Inativar</> : <><FiCheckCircle /> Ativar</>}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon info"><FiUsers /></div>
                        <div className="stat-body">
                            <div className="stat-label">Total de Membros</div>
                            <div className="stat-value">{members.length}</div>
                            <div className="stat-trend neutral">Pessoas vinculadas</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon warning"><FiTruck /></div>
                        <div className="stat-body">
                            <div className="stat-label">Entregas Recebidas</div>
                            <div className="stat-value">{deliveries.length}</div>
                            <div className="stat-trend neutral">Total de atendimentos</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className="stat-icon primary"><FiPhone /></div>
                        <div className="stat-body">
                            <div className="stat-label">Contato e Doc.</div>
                            <div className="stat-value" style={{ fontSize: '15px' }}>{family.phoneNumber || 'N/T'}</div>
                            <div className="stat-trend neutral">{family.responsibleDocument || 'Sem documento'}</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="stat-card">
                        <div className={`stat-icon ${family.active ? 'success' : 'danger'}`}><FiActivity /></div>
                        <div className="stat-body">
                            <div className="stat-label">Status da Família</div>
                            <div className={`stat-value ${family.active ? 'text-success' : 'text-danger'}`} style={{ fontSize: '18px' }}>
                                {family.active ? 'Ativa' : 'Inativa'}
                            </div>
                            <div className="stat-trend neutral">Situação cadastral</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address, Notes & Finance */}
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center gap-2 card-title mb-3">
                            <FiMapPin className="text-primary" />
                            <span>Endereço</span>
                        </div>
                        <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            {family.address || 'Endereço não cadastrado.'}
                        </p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center gap-2 card-title mb-3">
                            <FiFileText className="text-primary" />
                            <span>Observações do Cadastro</span>
                        </div>
                        <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            {family.notes || 'Nenhuma observação informada.'}
                        </p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center gap-2 card-title mb-3">
                            <FiUser className="text-primary" />
                            <span>Informações Financeiras</span>
                        </div>
                        <div className="d-flex flex-column gap-1">
                            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Renda Mensal:</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                                {family.monthlyIncome ? family.monthlyIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="row g-4">
                {/* Members Table */}
                <div className="col-12 col-xl-6">
                    <div className="card h-100">
                        <div className="card-header-custom border-0 pb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div className="card-title">Membros da Família</div>
                                <div className="card-subtitle">Pessoas vinculadas a esta residência</div>
                            </div>
                            <button
                                className="btn-primary-custom"
                                style={{ padding: '8px 12px', fontSize: '12px' }}
                                onClick={openCreateModal}
                            >
                                <FiPlus /> Adicionar
                            </button>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Idade</th>
                                        <th>Estado Civil</th>
                                        <th className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map(member => (
                                        <tr key={member.id}>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <div className="d-flex align-items-center gap-2">
                                                        {member.isResponsible && (
                                                            <FiStar className="text-warning" title="Responsável Familiar" size={14} fill="currentColor" />
                                                        )}
                                                        <strong>{member.name}</strong>
                                                    </div>
                                                    <span className={`badge-status ${member.active ? 'badge-delivered' : 'badge-cancelled'}`} style={{ width: 'fit-content', fontSize: '10px', marginTop: '4px' }}>
                                                        {member.active ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="td-muted">{calculateAge(member.birthDate)}</td>
                                            <td className="td-muted">{member.relationship || '-'}</td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button className="btn-icon-sm" title="Ver/Editar" onClick={() => openEditModal(member)}>
                                                        <FiEye />
                                                    </button>
                                                    <button
                                                        className={`btn-icon-sm ${member.active ? 'danger' : 'text-success'}`}
                                                        onClick={() => handleToggleMemberStatus(member)}
                                                    >
                                                        {member.active ? <FiSlash /> : <FiCheckCircle />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {members.length === 0 && (
                                        <tr><td colSpan={4} className="text-center py-4 text-muted">Nenhum membro cadastrado.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Deliveries Table */}
                <div className="col-12 col-xl-6">
                    <div className="card h-100">
                        <div className="card-header-custom border-0 pb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div className="card-title">Histórico de Entregas</div>
                                <div className="card-subtitle">Últimos atendimentos realizados</div>
                            </div>
                            {family.active && (
                                <button
                                    className="btn-primary-custom"
                                    style={{ padding: '8px 12px', fontSize: '12px', background: 'var(--warning)', border: 'none' }}
                                    onClick={() => navigate('/deliveries/create', { state: { familyId: family.id } })}
                                >
                                    <FiTruck /> Nova Entrega
                                </button>
                            )}
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Data da Entrega</th>
                                        <th>Itens</th>
                                        <th>Registrado por</th>
                                        <th className="text-end">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveries.map(delivery => (
                                        <tr key={delivery.id}>
                                            <td><strong>{formatDateBR(delivery.deliveryDate)}</strong></td>
                                            <td>
                                                <span className="category-pill">
                                                    {delivery.items.length} {delivery.items.length === 1 ? 'item' : 'itens'}
                                                </span>
                                            </td>
                                            <td className="td-muted">{delivery.createdByName}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn-icon-sm"
                                                    title="Ver Detalhes da Entrega"
                                                    onClick={() => navigate(`/deliveries/${delivery.id}`)}
                                                >
                                                    <FiEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {deliveries.length === 0 && (
                                        <tr><td colSpan={4} className="text-center py-4 text-muted">Nenhuma entrega registrada.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <FamilyMemberCreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSave={handleCreateMember}
                loading={saving}
                familyId={id!}
            />

            <FamilyMemberEditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleUpdateMember}
                loading={saving}
                initialData={selectedMember}
            />

            <FamilyEditModal
                show={showFamilyEditModal}
                onClose={() => setShowFamilyEditModal(false)}
                onSave={handleUpdateFamily}
                loading={saving}
                initialData={family}
            />
        </div>
    );
};

export default FamilyDetailPage;
