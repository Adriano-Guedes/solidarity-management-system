import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ItemResponse } from '../../../types/item';
import { deleteItem } from '../itemService';
import { FiEye, FiSlash, FiCheckCircle } from 'react-icons/fi';
import { notificationService } from '../../../utils/toastUtils';

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
                notificationService.success(`Status do item "${name}" alterado com sucesso!`);
            } catch (error) {
                notificationService.error(error);
            }
        }
    };

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Pacote</th>
                        <th>Total</th>
                        <th>Modelo Base</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th className="text-end">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>
                                <div><strong>{item.name}</strong></div>
                                {item.brand && <div className="td-muted" style={{ fontSize: '12px', marginTop: '2px' }}>{item.brand}</div>}
                            </td>
                            <td className="td-muted">{item.packageQuantity} {item.unitOfMeasure}</td>
                            <td>
                                <span className={`badge-status ${item.totalQuantity > 0 ? 'badge-delivered' : 'badge-cancelled'}`}>
                                    {item.totalQuantity}
                                </span>
                            </td>
                            <td>
                                <span className="category-pill">
                                    {item.itemTemplateName}
                                </span>
                            </td>
                            <td>
                                <span className="category-pill">
                                    {item.categoryName}
                                </span>
                            </td>
                            <td>
                                <span className={`badge-status ${item.active ? 'badge-delivered' : 'badge-cancelled'}`}>
                                    {item.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </td>
                            <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        className="btn-icon-sm text-primary"
                                        title="Ver detalhes"
                                        onClick={() => navigate(`/items/${item.id}`)}
                                    >
                                        <FiEye />
                                    </button>
                                    <button
                                        className={`btn-icon-sm ${item.active ? 'text-danger' : 'text-success'}`}
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
