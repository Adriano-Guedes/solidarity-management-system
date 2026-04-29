import React from 'react';
import type { FamilyResponse } from '../../../types/family';

interface FamilyTableProps {
  families: FamilyResponse[];
}

const FamilyTable: React.FC<FamilyTableProps> = ({ families }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Responsável</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {families.map(family => (
            <tr key={family.id}>
              <td>
                <strong>{family.responsibleName}</strong>
              </td>
              <td className="td-muted">{family.phoneNumber || '-'}</td>
              <td>
                <span className={`badge-status ${family.active ? 'badge-delivered' : 'badge-cancelled'}`}>
                  {family.active ? 'Ativa' : 'Inativa'}
                </span>
              </td>
              <td>
                <button
                  className="btn-icon-sm"
                  title="Ver detalhes"
                  onClick={() => console.log('Ver detalhes clicked')}
                >
                  <i className="bi bi-eye"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FamilyTable;
