import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiSlash, FiCheckCircle } from 'react-icons/fi';
import type { ItemTemplateResponse } from '../../../types/itemTemplate';

interface ItemTemplateTableProps {
  templates: ItemTemplateResponse[];
  onToggleActive: (template: ItemTemplateResponse) => void;
}

const ItemTemplateTable: React.FC<ItemTemplateTableProps> = ({ templates, onToggleActive }) => {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Grupo</th>
            <th>Status</th>
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(tpl => (
            <tr key={tpl.id}>
              <td>
                <div className="d-flex flex-column">
                  <strong>{tpl.name}</strong>
                  <span className="text-muted" style={{ fontSize: '11px' }}>
                    {tpl.isPerishable ? 'Perecível' : 'Não perecível'} 
                    {tpl.requiresRefrigeration && ' • Requer refrigeração'}
                  </span>
                </div>
              </td>
              <td className="td-muted">{tpl.categoryName}</td>
              <td><span className="category-pill">{tpl.needGroupName}</span></td>
              <td>
                <span className={`badge-status ${tpl.active ? 'badge-delivered' : 'badge-cancelled'}`}>
                  {tpl.active ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    className="btn-icon-sm text-primary" 
                    onClick={() => navigate(`/item-templates/${tpl.id}`)} 
                    title="Ver Detalhes"
                  >
                    <FiEye size={14} />
                  </button>
                  <button 
                    className={`btn-icon-sm ${tpl.active ? 'text-danger' : 'text-success'}`} 
                    onClick={() => onToggleActive(tpl)} 
                    title={tpl.active ? 'Inativar' : 'Ativar'}
                  >
                    {tpl.active ? <FiSlash size={14} /> : <FiCheckCircle size={14} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {templates.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-muted">Nenhum modelo cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTemplateTable;
