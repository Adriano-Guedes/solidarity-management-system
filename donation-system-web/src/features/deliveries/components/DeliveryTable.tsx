import React from 'react';
import type { DeliveryResponse } from '../../../types/delivery';
import { formatDateTimeBR } from '../../../utils/dateFormat';

interface DeliveryTableProps {
  deliveries: DeliveryResponse[];
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({ deliveries }) => {
  return (
    <div className="table-wrapper">
      <table>
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
              <td>
                <strong>{delivery.familyResponsableName}</strong>
              </td>
              <td className="td-muted">{formatDateTimeBR(delivery.deliveryDate)}</td>
              <td className="td-muted">{delivery.createdByName}</td>
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

export default DeliveryTable;
