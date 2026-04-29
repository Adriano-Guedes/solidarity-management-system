import React from 'react';
import { FiSearch, FiX, FiRefreshCw, FiPlus } from 'react-icons/fi';

interface SearchBarProps {
    search: string;
    inputPlaceholder: string;
    setSearch: (value: string) => void;
    loading: boolean;
    onSearch: () => void;
    onClear: () => void;
    onRefresh: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    search,
    setSearch,
    loading,
    onSearch,
    onClear,
    onRefresh,
    inputPlaceholder,
}) => {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '24px',
            width: '100%' 
        }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <FiSearch style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '16px'
                }} />
                <input
                    type="text"
                    style={{
                        width: '100%',
                        padding: '10px 16px 10px 40px',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        fontSize: '14px',
                        background: 'var(--body-bg)',
                        color: 'var(--text-main)',
                        outline: 'none',
                        transition: 'border-color var(--transition)',
                    }}
                    placeholder={inputPlaceholder}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') onSearch();
                    }}
                    disabled={loading}
                />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                    className="btn-primary-custom"
                    onClick={onSearch}
                    disabled={loading || !search.trim()}
                    style={{ padding: '10px 16px' }}
                >
                    <FiSearch /> <span>Buscar</span>
                </button>

                <button 
                    className="btn-ghost"
                    onClick={onClear}
                    disabled={loading || !search}
                    title="Limpar filtro"
                    style={{ padding: '10px' }}
                >
                    <FiX />
                </button>

                <button 
                    className="btn-ghost"
                    onClick={onRefresh}
                    disabled={loading}
                    title="Recarregar"
                    style={{ padding: '10px' }}
                >
                    <FiRefreshCw className={loading ? 'spin' : ''} />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
