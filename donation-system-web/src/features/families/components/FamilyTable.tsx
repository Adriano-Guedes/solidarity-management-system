import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FamilyResponse } from '../../../types/family';
import { updateFamilyStatus } from '../familyService';
import { FiEye, FiSlash, FiCheckCircle } from 'react-icons/fi';
import { notificationService } from '../../../utils/toastUtils';

interface FamilyTableProps {
  families: FamilyResponse[];
  onRefresh: () => void;
}

const FamilyTable: React.FC<FamilyTableProps> = ({ families, onRefresh }) => {
  const navigate = useNavigate();

  const handleToggleStatus = async (id: string, name: string, isActive: boolean) => {
    const action = isActive ? 'inativar' : 'ativar';
    const actionPast = isActive ? 'inativada' : 'ativada';
    if (window.confirm(`Deseja realmente ${action} a família de "${name}"?`)) {
      try {
        await updateFamilyStatus(id);

        onRefresh();
        notificationService.success(`Família ${actionPast} com sucesso!`);
      } catch (error) {
        notificationService.error(error);
      }
    }
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Responsável</th>
            <th>Telefone</th>
            <th>Status</th>
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {families.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-5 text-muted">
                Nenhuma família encontrada.
              </td>
            </tr>
          ) : (
            families.map(family => (
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
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn-icon-sm"
                      title="Ver detalhes"
                      onClick={() => navigate(`/families/${family.id}`)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className={`btn-icon-sm ${family.active ? 'danger' : 'text-success'}`}
                      title={family.active ? "Inativar família" : "Ativar família"}
                      onClick={() => handleToggleStatus(family.id, family.responsibleName, family.active)}
                    >
                      {family.active ? <FiSlash /> : <FiCheckCircle />}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FamilyTable;
