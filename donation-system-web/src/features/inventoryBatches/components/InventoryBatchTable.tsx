import React from 'react';
import type { InventoryBatchResponse } from '../../../types/inventoryBatch';
import { formatDateBR, formatDateTimeBR } from '../../../utils/dateFormat';
import { FiEdit3, FiEye } from 'react-icons/fi';

interface InventoryBatchTableProps {
    batches: InventoryBatchResponse[];
    onEdit: (batch: InventoryBatchResponse) => void;
}

const InventoryBatchTable: React.FC<InventoryBatchTableProps> = ({ batches, onEdit }) => {
    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Data de Validade</th>
                        <th>Qtd Disponível</th>
                        <th>Criado em</th>
                        <th className="text-end">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.map(batch => (
                        <tr key={batch.id}>
                            <td>
                                <strong>{formatDateBR(batch.expirationDate)}</strong>
                            </td>
                            <td>
                                <span className={`badge-status ${batch.quantityAvailable > 0 ? 'badge-delivered' : 'badge-cancelled'}`}>
                                    {batch.quantityAvailable}
                                </span>
                            </td>
                            <td>
                                <div className="td-muted">{formatDateTimeBR(batch.createdAt)}</div>
                            </td>
                            <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <button 
                                        className="btn-icon-sm" 
                                        title="Editar Lote"
                                        onClick={() => onEdit(batch)}
                                    >
                                        <FiEdit3 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {batches.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">
                                Nenhum lote em estoque para este item.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryBatchTable;
