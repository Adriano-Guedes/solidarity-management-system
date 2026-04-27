import React from 'react';
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { FaSync, FaTimes } from 'react-icons/fa';
import { COLORS } from '../constants';
import TableIconButton from './TableIconButton';

interface SearchBarProps {
    search: string;
    inputPlaceholder: string;
    setSearch: (value: string) => void;
    loading: boolean;
    onSearch: () => void;
    onAdd?: () => void;
    onClear: () => void;
    onRefresh: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    search,
    setSearch,
    loading,
    onSearch,
    onAdd,
    onClear,
    onRefresh,
    inputPlaceholder,
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 32px 0', maxWidth: '100%' }}>
            <input
                type="text"
                className="form-control"
                placeholder={inputPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') onSearch();
                }}
                style={{ flex: 1 }}
                disabled={loading}
            />
            <TableIconButton
                icon={<FaMagnifyingGlass color={COLORS.white} />}
                title="Buscar"
                onClick={onSearch}
                bgColor={COLORS.secondary}
                disabled={loading || !search.trim()}
            />
            <TableIconButton
                icon={<FaTimes color={COLORS.white} />}
                title="Limpar filtro"
                onClick={onClear}
                bgColor={COLORS.danger}
                disabled={loading || !search}
            />
            {onAdd && (
                <TableIconButton
                    icon={<FaPlus color={COLORS.white} />}
                    title="Adicionar"
                    onClick={onAdd}
                    bgColor={COLORS.success}
                    disabled={loading}
                />
            )}
            <TableIconButton
                icon={<FaSync color={COLORS.white} />}
                title="Recarregar"
                onClick={onRefresh}
                bgColor={COLORS.textSecondary}
                disabled={loading}
            />
        </div>
    );
};

export default SearchBar;
