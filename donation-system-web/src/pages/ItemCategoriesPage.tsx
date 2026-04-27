import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import type { ItemCategoryResponse } from '../types/itemCategory';
import { getAllItemCategories } from '../features/itemCategories/itemCategoryService';
import SearchBar from '../components/SearchBar';
import ItemCategoryTable from '../features/itemCategories/components/ItemCategoryTable';

const ItemCategoriesPage = () => {
  const [items, setItems] = useState<ItemCategoryResponse[]>([]);
  const [allItems, setAllItems] = useState<ItemCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  // Busca na API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllItemCategories();
      setItems(data);
      setAllItems(data);
    } catch {
      setError('Failed to fetch item categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  function searchHandler() {
    if (!search.trim()) return;
    setSearching(true);
    const filtered = allItems.filter(item =>
      item.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    setItems(filtered);
    setSearching(false);
  }

  function clearHandler() {
    setSearch('');
    setItems(allItems);
  }

  function refreshHandler() {
    setSearch('');
    fetchItems();
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', background: '#F8FAFC', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        background: '#F8FAFC',
      }}>
        <div style={{
          width: '100%',
          minHeight: '100vh',
          background: '#fff',
          padding: 40,
          borderRadius: 0,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          border: '1px solid #CBD5E1',
          margin: '0 0',
        }}>
          <h1 style={{ color: '#0B1F3A' }}>Categorias de Itens</h1>
          <SearchBar
            inputPlaceholder='Buscar por nome da categoria...'
            search={search}
            setSearch={setSearch}
            loading={loading}
            onSearch={searchHandler}
            onAdd={() => {}}
            onClear={clearHandler}
            onRefresh={refreshHandler}
          />
          <ItemCategoryTable itemCategories={items} />
        </div>
      </main>
    </div>
  );
};

export default ItemCategoriesPage;
