import React, { useEffect, useState } from 'react';
import { FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { notificationService } from '../../utils/toastUtils';
import { getAllItemTemplates, createItemTemplate, deleteItemTemplate } from '../../features/itemTemplates/itemTemplateService';
import ItemTemplateTable from '../../features/itemTemplates/components/ItemTemplateTable';
import ItemTemplateCreateModal from '../../features/itemTemplates/components/ItemTemplateCreateModal';
import type { ItemTemplateResponse, CreateItemTemplateRequest } from '../../types/itemTemplate';

const ItemTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<ItemTemplateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getAllItemTemplates();
      setTemplates(data);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateItemTemplateRequest) => {
    setModalLoading(true);
    try {
      await createItemTemplate(data);
      notificationService.success('Modelo de item criado com sucesso!');
      setShowCreateModal(false);
      fetchTemplates();
    } catch (err) {
      notificationService.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleActive = async (template: ItemTemplateResponse) => {
    const action = template.active ? 'inativar' : 'ativar';
    if (window.confirm(`Deseja realmente ${action} este modelo?`)) {
      try {
        await deleteItemTemplate(template.id);
        notificationService.success(`Modelo ${template.active ? 'inativado' : 'ativado'} com sucesso!`);
        fetchTemplates();
      } catch (err) {
        notificationService.error(err);
      }
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.categoryName.toLowerCase().includes(search.toLowerCase()) ||
    t.needGroupName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex flex-column gap-4">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="fw-bold" style={{ fontSize: '24px', margin: 0 }}>Modelos de Itens</h1>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Gerencie os tipos base de itens e suas regras de sugestão</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-ghost" onClick={fetchTemplates} disabled={loading}>
            <FiRefreshCw className={loading ? 'spin' : ''} /> Atualizar
          </button>
          <button className="btn-primary-custom" onClick={() => setShowCreateModal(true)}>
            <FiPlus /> Novo Modelo
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text bg-white border-end-0"><FiSearch className="text-muted" /></span>
            <input 
              type="text" 
              className="form-control border-start-0" 
              placeholder="Pesquisar modelos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-muted" style={{ fontSize: '13px' }}>
            {filteredTemplates.length} modelos encontrados
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-2">Carregando modelos...</p>
            </div>
          ) : (
            <ItemTemplateTable templates={filteredTemplates} onToggleActive={handleToggleActive} />
          )}
        </div>
      </div>

      <ItemTemplateCreateModal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSave={handleCreate}
        loading={modalLoading}
      />
    </div>
  );
};

export default ItemTemplatesPage;
