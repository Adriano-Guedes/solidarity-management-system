import React from 'react';
import type { DeliveryResponse } from '../../../types/delivery';
import { formatDateBR } from '../../../utils/dateFormat';
import { FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface DeliveryTableProps {
  deliveries: DeliveryResponse[];
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({ deliveries }) => {
  const navigate = useNavigate();
  
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Data de Entrega</th>
            <th>Responsável da Família</th>
            <th>Itens</th>
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-5 text-muted">
                Nenhuma entrega encontrada.
              </td>
            </tr>
          ) : (
            deliveries.map(delivery => (
              <tr key={delivery.id}>
                <td>
                  <div className="d-flex flex-column">
                    <strong>{formatDateBR(delivery.deliveryDate)}</strong>
                    <span className="td-muted" style={{ fontSize: '11px' }}>
                      Por: {delivery.createdByName}
                    </span>
                  </div>
                </td>
                <td>
                  <strong>{delivery.familyResponsibleName}</strong>
                </td>
                <td>
                  <span className="category-pill">
                    {delivery.items.length} {delivery.items.length === 1 ? 'item' : 'itens'}
                  </span>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn-icon-sm text-primary"
                      title="Ver detalhes"
                      onClick={() => navigate(`/deliveries/${delivery.id}`)}
                    >
                      <FiEye />
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

export default DeliveryTable;
