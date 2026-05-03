import React from 'react';
import { FiEdit2, FiSlash, FiCheckCircle } from 'react-icons/fi';
import type { AgeRangeResponse } from '../../../types/ageRange';

interface AgeRangeTableProps {
  ageRanges: AgeRangeResponse[];
  onEdit: (ageRange: AgeRangeResponse) => void;
  onToggleActive: (ageRange: AgeRangeResponse) => void;
}

const AgeRangeTable: React.FC<AgeRangeTableProps> = ({ ageRanges, onEdit, onToggleActive }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Idade Mínima</th>
            <th>Idade Máxima</th>
            <th>Status</th>
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {ageRanges.map(ar => (
            <tr key={ar.id}>
              <td><strong>{ar.name}</strong></td>
              <td className="td-muted">{ar.minAge} anos</td>
              <td className="td-muted">{ar.maxAge} anos</td>
              <td>
                <span className={`badge-status ${ar.active ? 'badge-delivered' : 'badge-cancelled'}`}>
                  {ar.active ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn-icon-sm text-primary" onClick={() => onEdit(ar)} title="Editar">
                    <FiEdit2 size={14} />
                  </button>
                  <button 
                    className={`btn-icon-sm ${ar.active ? 'text-danger' : 'text-success'}`} 
                    onClick={() => onToggleActive(ar)} 
                    title={ar.active ? 'Inativar' : 'Ativar'}
                  >
                    {ar.active ? <FiSlash size={14} /> : <FiCheckCircle size={14} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {ageRanges.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-muted">Nenhuma faixa etária cadastrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgeRangeTable;
