import React from 'react';
import { FiEdit2, FiTrash2, FiLayers } from 'react-icons/fi';
import type { NeedRuleResponse } from '../../../types/needRule';
import type { AgeRangeResponse } from '../../../types/ageRange';

interface NeedRuleTableProps {
  needRules: NeedRuleResponse[];
  ageRanges: AgeRangeResponse[];
  onEdit: (needRule: NeedRuleResponse) => void;
  onDelete: (id: string) => void;
}

const NeedRuleTable: React.FC<NeedRuleTableProps> = ({ needRules, ageRanges, onEdit, onDelete }) => {
  // Helper to get minAge for sorting
  const getMinAge = (ageRangeId: string) => {
    return ageRanges.find(ar => ar.id === ageRangeId)?.minAge ?? 999;
  };

  // Group rules and sort them by age
  const groupedRules = needRules.reduce((acc, rule) => {
    const groupName = rule.needGroupName || 'Sem Grupo';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(rule);
    return acc;
  }, {} as Record<string, NeedRuleResponse[]>);

  // Sort groups and sort items within each group
  const groupNames = Object.keys(groupedRules).sort();
  
  groupNames.forEach(name => {
    groupedRules[name].sort((a, b) => getMinAge(a.ageRangeId) - getMinAge(b.ageRangeId));
  });

  if (needRules.length === 0) {
    return (
      <div className="text-center py-5 text-muted card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        Nenhuma regra cadastrada.
      </div>
    );
  }

  return (
    <div className="row g-4">
      {groupNames.map(groupName => (
        <div key={groupName} className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="card-header bg-white py-3 px-4 border-bottom d-flex align-items-center gap-2">
              <FiLayers className="text-primary" />
              <h6 className="mb-0 fw-bold">{groupName}</h6>
            </div>
            <div className="table-wrapper m-0">
              <table className="mb-0">
                <thead>
                  <tr>
                    <th>Faixa Etária</th>
                    <th className="text-center">Valor Base</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedRules[groupName].map(nr => (
                    <tr key={nr.id}>
                      <td><strong>{nr.ageRangeName}</strong></td>
                      <td className="fw-bold text-center text-primary">{nr.value}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn-icon-sm text-primary" onClick={() => onEdit(nr)} title="Editar">
                            <FiEdit2 size={14} />
                          </button>
                          <button className="btn-icon-sm text-danger" onClick={() => onDelete(nr.id)} title="Excluir">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NeedRuleTable;
