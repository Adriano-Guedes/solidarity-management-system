import React from 'react';
import type { DonationResponse } from '../../../types/donation';
import { formatDateTimeBR } from '../../../utils/dateFormat';

interface DonationTableProps {
    donations: DonationResponse[];
}

const DonationTable: React.FC<DonationTableProps> = ({ donations }) => {
    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Data de Recebimento</th>
                        <th>Criado Por</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map(donation => (
                        <tr key={donation.id}>
                            <td>
                                <strong>{formatDateTimeBR(donation.receivedDate)}</strong>
                            </td>
                            <td className="td-muted">{donation.createdByName}</td>
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

export default DonationTable;
