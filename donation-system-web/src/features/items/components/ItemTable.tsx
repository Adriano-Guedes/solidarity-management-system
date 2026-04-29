import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ItemResponse } from '../../../types/item';
import { deleteItem } from '../itemService';
import { FiEye, FiSlash, FiCheckCircle } from 'react-icons/fi';

interface ItemTableProps {
    items: ItemResponse[];
    onRefresh: () => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onRefresh }) => {
    const navigate = useNavigate();

    const handleToggleStatus = async (id: string, name: string, isActive: boolean) => {
        const action = isActive ? 'inativar' : 'ativar';
        if (window.confirm(`Deseja realmente ${action} o item "${name}"?`)) {
            try {
                await deleteItem(id);
                onRefresh();
            } catch (error) {
                alert(`Erro ao ${action} item`);
                console.error(error);
            }
        }
    };

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Marca</th>
                        <th>Pacote</th>
                        <th>Status</th>
                        <th>Categoria</th>
                        <th>Modelo Base</th>
                        <th className="text-end">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>
                                <strong>{item.name}</strong>
                            </td>
                            <td className="td-muted">{item.brand}</td>
                            <td className="td-muted">{item.packageQuantity} {item.unitOfMeasure}</td>
                            <td>
                                <span className={`badge-status ${item.active ? 'badge-delivered' : 'badge-cancelled'}`}>
                                    {item.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </td>
                            <td>
                                <span className="category-pill">
                                    {item.categoryName}
                                </span>
                            </td>
                            <td>
                                <span className="category-pill">
                                    {item.itemTemplateName}
                                </span>
                            </td>
                            <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        className="btn-icon-sm"
                                        title="Ver detalhes"
                                        onClick={() => navigate(`/items/${item.id}`)}
                                    >
                                        <FiEye />
                                    </button>
                                    <button
                                        className={`btn-icon-sm ${item.active ? 'danger' : 'text-success'}`}
                                        title={item.active ? "Inativar item" : "Ativar item"}
                                        onClick={() => handleToggleStatus(item.id, item.name, item.active)}
                                    >
                                        {item.active ? <FiSlash /> : <FiCheckCircle />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;
