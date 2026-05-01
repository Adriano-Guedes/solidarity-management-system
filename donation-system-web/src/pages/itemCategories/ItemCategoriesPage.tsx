import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { ItemCategoryResponse, CreateItemCategoryRequest } from '../../types/itemCategory';
import { getAllItemCategories, createItemCategory } from '../../features/itemCategories/itemCategoryService';
import SearchBar from '../../components/SearchBar';
import ItemCategoryTable from '../../features/itemCategories/components/ItemCategoryTable';
import ItemCategoryCreateModal from '../../features/itemCategories/components/ItemCategoryCreateModal';
import { notificationService } from '../../utils/toastUtils';

interface ContextType {
  setOnAddClick: (fn: (() => void) | null) => void;
}

const ItemCategoriesPage = () => {
  const [items, setItems] = useState<ItemCategoryResponse[]>([]);
  const [allItems, setAllItems] = useState<ItemCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { setOnAddClick } = useOutletContext<ContextType>();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAllItemCategories();
      setItems(data);
      setAllItems(data);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setOnAddClick(() => () => setShowCreateModal(true));
    
    return () => setOnAddClick(null);
  }, [setOnAddClick]);

  async function handleCreateCategory(data: CreateItemCategoryRequest) {
    setSaving(true);
    try {
      await createItemCategory(data);
      notificationService.success('Categoria cadastrada com sucesso!');
      await fetchItems();
      setShowCreateModal(false);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setSaving(false);
    }
  }

  function searchHandler() {
    const filtered = allItems.filter(item =>
      item.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    setItems(filtered);
  }

  if (loading && items.length === 0) return (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="d-flex flex-column">
      <div className="card h-100">
        <div className="p-4 pb-0">
          <SearchBar
            inputPlaceholder='Buscar por nome da categoria...'
            search={search}
            setSearch={setSearch}
            loading={loading}
            onSearch={searchHandler}
            onClear={() => { setSearch(''); setItems(allItems); }}
            onRefresh={fetchItems}
          />
        </div>

        <ItemCategoryTable itemCategories={items} onRefresh={fetchItems} />
      </div>

      <ItemCategoryCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCategory}
        loading={saving}
      />
    </div>
  );
};

export default ItemCategoriesPage;
