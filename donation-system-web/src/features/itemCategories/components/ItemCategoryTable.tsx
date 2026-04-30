import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ItemCategoryResponse } from '../../../types/itemCategory';
import { deleteItemCategory } from '../itemCategoryService';
import { FiEye, FiSlash, FiCheckCircle } from 'react-icons/fi';
import { notificationService } from '../../../utils/toastUtils';

interface ItemCategoryTableProps {
    itemCategories: ItemCategoryResponse[];
    onRefresh: () => void;
}

const ItemCategoryTable: React.FC<ItemCategoryTableProps> = ({ itemCategories, onRefresh }) => {
    const navigate = useNavigate();

    const handleToggleStatus = async (id: string, name: string, isActive: boolean) => {
        const action = isActive ? 'inativar' : 'ativar';
        if (window.confirm(`Deseja realmente ${action} a categoria "${name}"?`)) {
            try {
                await deleteItemCategory(id);
                onRefresh();
                notificationService.success(`Status da categoria "${name}" alterado com sucesso!`);
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
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Status</th>
                        <th className="text-end">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {itemCategories.map(cat => (
                        <tr key={cat.id}>
                            <td>
                                <strong>{cat.name}</strong>
                            </td>
                            <td className="td-muted">{cat.description}</td>
                            <td>
                                <span className={`badge-status ${cat.active ? 'badge-delivered' : 'badge-cancelled'}`}>
                                    {cat.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </td>
                            <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        className="btn-icon-sm"
                                        title="Ver detalhes"
                                        onClick={() => navigate(`/item-categories/${cat.id}`)}
                                    >
                                        <FiEye />
                                    </button>
                                    <button
                                        className={`btn-icon-sm ${cat.active ? 'danger' : 'text-success'}`}
                                        title={cat.active ? "Inativar categoria" : "Ativar categoria"}
                                        onClick={() => handleToggleStatus(cat.id, cat.name, cat.active)}
                                    >
                                        {cat.active ? <FiSlash /> : <FiCheckCircle />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {itemCategories.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-4 text-muted">
                                Nenhuma categoria cadastrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ItemCategoryTable;
