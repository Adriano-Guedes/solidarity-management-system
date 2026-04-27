import React from 'react';
import type { DonationResponse } from '../../../types/donation';
import { formatDateTimeBR } from '../../../utils/dateFormat';
import TableIconButton from '../../../components/TableIconButton';
import { FaClipboardList } from 'react-icons/fa6';
import { COLORS } from '../../../constants';

interface DonationTableProps {
    donations: DonationResponse[];
}

const DonationTable: React.FC<DonationTableProps> = ({ donations }) => {
    return (
        <table className="table table-hover">
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
                        <td>{formatDateTimeBR(donation.receivedDate)}</td>
                        <td>{donation.createdByName}</td>
                        <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TableIconButton
                                icon={<FaClipboardList color={COLORS.white}/>}
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

export default DonationTable;
