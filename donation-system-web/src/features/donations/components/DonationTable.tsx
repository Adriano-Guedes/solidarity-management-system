import React from 'react';
import type { DonationResponse } from '../../../types/donation';
import { formatDateBR, formatDateTimeBR } from '../../../utils/dateFormat';
import { useNavigate } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';

interface DonationTableProps {
    donations: DonationResponse[];
}

const DonationTable: React.FC<DonationTableProps> = ({ donations }) => {
    const navigate = useNavigate();

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Data de Recebimento</th>
                        <th>Responsável</th>
                        <th>Itens</th>
                        <th className="text-end">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-5 text-muted">
                                Nenhuma doação encontrada.
                            </td>
                        </tr>
                    ) : (
                        donations.map(donation => (
                            <tr key={donation.id}>
                                <td>
                                    <div className="d-flex flex-column">
                                        <strong>{formatDateBR(donation.receivedDate)}</strong>
                                        <span className="td-muted" style={{ fontSize: '11px' }}>
                                            Registrado em: {formatDateTimeBR(donation.createdAt)}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <strong>{donation.createdByName}</strong>
                                </td>
                                <td>
                                    <span className="category-pill">
                                        {donation.items.length} {donation.items.length === 1 ? 'item' : 'itens'}
                                    </span>
                                </td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn-icon-sm text-primary"
                                            title="Ver detalhes"
                                            onClick={() => navigate(`/donations/${donation.id}`)}
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

export default DonationTable;
