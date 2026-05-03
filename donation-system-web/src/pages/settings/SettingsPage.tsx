import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { FiUsers, FiLayers, FiSettings, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { notificationService } from '../../utils/toastUtils';

// Age Ranges
import { getAllAgeRanges, getActiveAgeRanges, createAgeRange, updateAgeRange, deleteAgeRange } from '../../features/ageRanges/ageRangeService';
import AgeRangeTable from '../../features/ageRanges/components/AgeRangeTable';
import AgeRangeCreateModal from '../../features/ageRanges/components/AgeRangeCreateModal';
import AgeRangeEditModal from '../../features/ageRanges/components/AgeRangeEditModal';
import type { AgeRangeResponse, CreateAgeRangeRequest, UpdateAgeRangeRequest } from '../../types/ageRange';

// Need Groups
import { getAllNeedGroups, getActiveNeedGroups, createNeedGroup, updateNeedGroup, deleteNeedGroup } from '../../features/needGroups/needGroupService';
import NeedGroupTable from '../../features/needGroups/components/NeedGroupTable';
import NeedGroupCreateModal from '../../features/needGroups/components/NeedGroupCreateModal';
import NeedGroupEditModal from '../../features/needGroups/components/NeedGroupEditModal';
import type { NeedGroupResponse, CreateNeedGroupRequest, UpdateNeedGroupRequest } from '../../types/needGroup';

// Need Rules
import { getAllNeedRules, createNeedRule, updateNeedRule, deleteNeedRule } from '../../features/needRules/needRuleService';
import NeedRuleTable from '../../features/needRules/components/NeedRuleTable';
import NeedRuleCreateModal from '../../features/needRules/components/NeedRuleCreateModal';
import NeedRuleEditModal from '../../features/needRules/components/NeedRuleEditModal';
import type { NeedRuleResponse, CreateNeedRuleRequest, UpdateNeedRuleRequest } from '../../types/needRule';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('age-ranges');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Data States
  const [ageRanges, setAgeRanges] = useState<AgeRangeResponse[]>([]);
  const [needGroups, setNeedGroups] = useState<NeedGroupResponse[]>([]);
  const [needRules, setNeedRules] = useState<NeedRuleResponse[]>([]);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'age-ranges') {
        const data = await getAllAgeRanges();
        setAgeRanges(data);
      } else if (activeTab === 'need-groups') {
        const data = await getAllNeedGroups();
        setNeedGroups(data);
      } else if (activeTab === 'need-rules') {
        const [rules, ranges, groups] = await Promise.all([
          getAllNeedRules(),
          getAllAgeRanges(),
          getActiveNeedGroups()
        ]);
        setNeedRules(rules);
        setAgeRanges(ranges);
        setNeedGroups(groups);
      }
    } catch (err) {
      notificationService.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Handlers - Age Ranges
  const handleCreateAgeRange = async (data: CreateAgeRangeRequest) => {
    setModalLoading(true);
    try {
      await createAgeRange(data);
      notificationService.success('Faixa etária criada com sucesso!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateAgeRange = async (id: string, data: UpdateAgeRangeRequest) => {
    setModalLoading(true);
    try {
      await updateAgeRange(id, data);
      notificationService.success('Faixa etária atualizada!');
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleAgeRangeActive = async (item: AgeRangeResponse) => {
    try {
      await updateAgeRange(item.id, {
        name: item.name,
        minAge: item.minAge,
        maxAge: item.maxAge,
        active: !item.active
      });
      notificationService.success(`Faixa etária ${item.active ? 'inativada' : 'ativada'} com sucesso!`);
      fetchData();
    } catch (err) {
      notificationService.error(err);
    }
  };

  // CRUD Handlers - Need Groups
  const handleCreateNeedGroup = async (data: CreateNeedGroupRequest) => {
    setModalLoading(true);
    try {
      await createNeedGroup(data);
      notificationService.success('Grupo de necessidade criado!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateNeedGroup = async (id: string, data: UpdateNeedGroupRequest) => {
    setModalLoading(true);
    try {
      await updateNeedGroup(id, data);
      notificationService.success('Grupo atualizado!');
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleNeedGroupActive = async (item: NeedGroupResponse) => {
    try {
      await updateNeedGroup(item.id, {
        name: item.name,
        active: !item.active
      });
      notificationService.success(`Grupo ${item.active ? 'inativado' : 'ativado'} com sucesso!`);
      fetchData();
    } catch (err) {
      notificationService.error(err);
    }
  };

  // CRUD Handlers - Need Rules
  const handleCreateNeedRule = async (data: CreateNeedRuleRequest) => {
    setModalLoading(true);
    try {
      await createNeedRule(data);
      notificationService.success('Regra de necessidade criada!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateNeedRule = async (id: string, data: UpdateNeedRuleRequest) => {
    setModalLoading(true);
    try {
      await updateNeedRule(id, data);
      notificationService.success('Regra atualizada!');
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteNeedRule = async (id: string) => {
    if (window.confirm('Excluir esta regra?')) {
      try {
        await deleteNeedRule(id);
        notificationService.success('Regra excluída.');
        fetchData();
      } catch (err) {
        notificationService.error(err);
      }
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="fw-bold" style={{ fontSize: '24px', margin: 0 }}>Configurações do Sistema</h1>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Gerencie parâmetros globais, faixas etárias e regras de atendimento</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-ghost" onClick={fetchData} disabled={loading}>
            <FiRefreshCw className={loading ? 'spin' : ''} /> Atualizar
          </button>
          <button className="btn-primary-custom" onClick={() => setShowCreateModal(true)}>
            <FiPlus /> Novo Registro
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-2" style={{ borderRadius: '16px' }}>
        <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k as string)} className="gap-2 p-2">
          <Nav.Item>
            <Nav.Link eventKey="age-ranges" className="d-flex align-items-center gap-2">
              <FiUsers /> Faixas Etárias
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="need-groups" className="d-flex align-items-center gap-2">
              <FiLayers /> Grupos de Necessidade
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="need-rules" className="d-flex align-items-center gap-2">
              <FiSettings /> Regras de Necessidade
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="p-3">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Carregando configurações...</p>
            </div>
          ) : (
            <>
              {activeTab === 'age-ranges' && (
                <AgeRangeTable ageRanges={ageRanges} onEdit={handleEdit} onToggleActive={handleToggleAgeRangeActive} />
              )}
              {activeTab === 'need-groups' && (
                <NeedGroupTable needGroups={needGroups} onEdit={handleEdit} onToggleActive={handleToggleNeedGroupActive} />
              )}
              {activeTab === 'need-rules' && (
                <NeedRuleTable needRules={needRules} ageRanges={ageRanges} onEdit={handleEdit} onDelete={handleDeleteNeedRule} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals - Age Ranges */}
      {activeTab === 'age-ranges' && (
        <>
          <AgeRangeCreateModal show={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleCreateAgeRange} loading={modalLoading} />
          <AgeRangeEditModal show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleUpdateAgeRange} initialData={selectedItem} loading={modalLoading} />
        </>
      )}

      {/* Modals - Need Groups */}
      {activeTab === 'need-groups' && (
        <>
          <NeedGroupCreateModal show={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleCreateNeedGroup} loading={modalLoading} />
          <NeedGroupEditModal show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleUpdateNeedGroup} initialData={selectedItem} loading={modalLoading} />
        </>
      )}

      {/* Modals - Need Rules */}
      {activeTab === 'need-rules' && (
        <>
          <NeedRuleCreateModal show={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleCreateNeedRule} loading={modalLoading} ageRanges={ageRanges.filter(ar => ar.active)} needGroups={needGroups} />
          <NeedRuleEditModal show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleUpdateNeedRule} initialData={selectedItem} loading={modalLoading} ageRanges={ageRanges.filter(ar => ar.active)} needGroups={needGroups} />
        </>
      )}
    </div>
  );
};

export default SettingsPage;
