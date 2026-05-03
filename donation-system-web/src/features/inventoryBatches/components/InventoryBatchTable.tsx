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
                    {batches.map(batch => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        const expDate = batch.expirationDate ? new Date(batch.expirationDate) : null;
                        if (expDate) expDate.setHours(0, 0, 0, 0);

                        const isExpired = expDate ? expDate < today : false;
                        
                        const fifteenDaysFromNow = new Date(today);
                        fifteenDaysFromNow.setDate(today.getDate() + 15);
                        
                        const isNearExpiration = expDate ? (expDate >= today && expDate <= fifteenDaysFromNow) : false;

                        const daysRemaining = expDate ? Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;

                        return (
                            <tr key={batch.id}>
                                <td>
                                    <strong style={{ color: isExpired ? '#dc2626' : isNearExpiration ? '#eab308' : 'inherit' }}>
                                        {formatDateBR(batch.expirationDate)}
                                    </strong>
                                    {isExpired && <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>Vencido</div>}
                                    {isNearExpiration && (
                                        <div style={{ color: '#eab308', fontSize: '12px', fontWeight: 600 }}>
                                            Vence em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                                        </div>
                                    )}
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
                        );
                    })}
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
