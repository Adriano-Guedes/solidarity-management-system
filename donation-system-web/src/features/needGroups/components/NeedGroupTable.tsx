import React from 'react';
import { FiEdit2, FiSlash, FiCheckCircle } from 'react-icons/fi';
import type { NeedGroupResponse } from '../../../types/needGroup';

interface NeedGroupTableProps {
  needGroups: NeedGroupResponse[];
  onEdit: (needGroup: NeedGroupResponse) => void;
  onToggleActive: (needGroup: NeedGroupResponse) => void;
}

const NeedGroupTable: React.FC<NeedGroupTableProps> = ({ needGroups, onEdit, onToggleActive }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status</th>
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {needGroups.map(ng => (
            <tr key={ng.id}>
              <td><strong>{ng.name}</strong></td>
              <td>
                <span className={`badge-status ${ng.active ? 'badge-delivered' : 'badge-cancelled'}`}>
                  {ng.active ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn-icon-sm text-primary" onClick={() => onEdit(ng)} title="Editar">
                    <FiEdit2 size={14} />
                  </button>
                  <button 
                    className={`btn-icon-sm ${ng.active ? 'text-danger' : 'text-success'}`} 
                    onClick={() => onToggleActive(ng)} 
                    title={ng.active ? 'Inativar' : 'Ativar'}
                  >
                    {ng.active ? <FiSlash size={14} /> : <FiCheckCircle size={14} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {needGroups.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-muted">Nenhum grupo cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NeedGroupTable;
