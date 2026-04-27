import React from 'react';
import type { DeliveryResponse } from '../../../types/delivery';
import TableIconButton from '../../../components/TableIconButton';
import { FaClipboardList } from 'react-icons/fa6';
import { COLORS } from '../../../constants';
import { formatDateTimeBR } from '../../../utils/dateFormat';

interface DeliveryTableProps {
  deliveries: DeliveryResponse[];
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({ deliveries }) => {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Responsável da Família</th>
          <th>Data de Entrega</th>
          <th>Registrada Por</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {deliveries.map(delivery => (
          <tr key={delivery.id}>
            <td>{delivery.familyResponsableName}</td>
            <td>{formatDateTimeBR(delivery.deliveryDate)}</td>
            <td>{delivery.createdByName}</td>
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

export default DeliveryTable;
