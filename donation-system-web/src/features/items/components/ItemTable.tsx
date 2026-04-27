import React from 'react';
import { formatDateTimeBR } from '../../../utils/dateFormat';
import TableIconButton from '../../../components/TableIconButton';
import { FaClipboardList } from 'react-icons/fa6';
import { COLORS } from '../../../constants';
import type { ItemResponse } from '../../../types/item';

interface ItemTableProps {
    items: ItemResponse[];
}

const ItemTable: React.FC<ItemTableProps> = ({ items }) => {
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Marca</th>
                    <th>Pacote</th>
                    <th>Qtd Total</th>
                    <th>Status</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.brand}</td>
                        <td>{item.packageQuantity} {item.unitOfMeasure}</td>
                        <td>-</td>
                        <td>{item.active ? 'Ativo' : 'Inativo'}</td>
                        <td>{item.categoryName}</td>
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

export default ItemTable;
