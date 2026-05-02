import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { ItemResponse, CreateItemRequest } from '../../types/item';
import { getAllItems, createItem } from '../../features/items/itemService';
import ItemTable from '../../features/items/components/ItemTable';
import ItemCreateModal from '../../features/items/components/ItemCreateModal';
import SearchBar from '../../components/SearchBar';
import { notificationService } from '../../utils/toastUtils';

interface ContextType {
  setOnAddClick: (fn: (() => void) | null) => void;
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [allItems, setAllItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { setOnAddClick } = useOutletContext<ContextType>();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAllItems();
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
    // Register the action for the global header button in MainLayout
    setOnAddClick(() => () => setShowCreateModal(true));
    
    // Cleanup on unmount
    return () => setOnAddClick(null);
  }, [setOnAddClick]);

  async function handleCreateItem(data: CreateItemRequest) {
    setSaving(true);
    try {
      await createItem(data);
      notificationService.success('Item cadastrado com sucesso!');
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
      || item.categoryName.toLowerCase().includes(search.trim().toLowerCase())
      || item.itemTemplateName.toLowerCase().includes(search.trim().toLowerCase())
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
            inputPlaceholder='Buscar por nome do item, categoria ou modelo...'
            search={search}
            setSearch={setSearch}
            loading={loading}
            onSearch={searchHandler}
            onClear={() => { setSearch(''); setItems(allItems); }}
            onRefresh={fetchItems}
          />
        </div>

        <ItemTable items={items} onRefresh={fetchItems} />
      </div>

      <ItemCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateItem}
        loading={saving}
      />
    </div>
  );
};

export default ItemsPage;
