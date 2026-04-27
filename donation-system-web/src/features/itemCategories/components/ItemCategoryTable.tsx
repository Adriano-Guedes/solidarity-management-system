import React from 'react';
import TableIconButton from '../../../components/TableIconButton';
import { FaClipboardList } from 'react-icons/fa6';
import { COLORS } from '../../../constants';
import type { ItemCategoryResponse } from '../../../types/itemCategory';

interface ItemCategoryTableProps {
    itemCategories: ItemCategoryResponse[];
}

const ItemCategoryTable: React.FC<ItemCategoryTableProps> = ({ itemCategories }) => {
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {itemCategories.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.active ? 'Ativo' : 'Inativo'}</td>
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

export default ItemCategoryTable;
