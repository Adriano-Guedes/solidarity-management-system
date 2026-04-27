import React from 'react';
import type { FamilyResponse } from '../../../types/family';
import TableIconButton from '../../../components/TableIconButton';
import { FaClipboardList } from 'react-icons/fa6';
import { COLORS } from '../../../constants';

interface FamilyTableProps {
  families: FamilyResponse[];
}

const FamilyTable: React.FC<FamilyTableProps> = ({ families }) => {
  return (
    <table className="table table-hover">
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
            <td>{family.responsibleName}</td>
            <td>{family.phoneNumber || '-'}</td>
            <td>{family.active ? 'Ativa' : 'Inativa'}</td>
            <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TableIconButton
                icon={<FaClipboardList color={COLORS.white} />}
                title="Ver detalhes"
                onClick={() => console.log('Ver detalhes clicked')}
                bgColor={COLORS.primary}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FamilyTable;
