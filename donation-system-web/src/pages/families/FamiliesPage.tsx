import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getAllFamilies, createFamily } from '../../features/families/familyService';
import FamilyTable from '../../features/families/components/FamilyTable';
import FamilyCreateModal from '../../features/families/components/FamilyCreateModal';
import type { FamilyResponse, CreateFamilyRequest } from '../../types/family';
import SearchBar from '../../components/SearchBar';
import { notificationService } from '../../utils/toastUtils';

interface ContextType {
  setOnAddClick: (fn: (() => void) | null) => void;
}

const FamiliesPage: React.FC = () => {
  const [families, setFamilies] = useState<FamilyResponse[]>([]);
  const [allFamilies, setAllFamilies] = useState<FamilyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { setOnAddClick } = useOutletContext<ContextType>();

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const data = await getAllFamilies();
      setFamilies(data);
      setAllFamilies(data);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  useEffect(() => {
    setOnAddClick(() => () => setShowCreateModal(true));
    return () => setOnAddClick(null);
  }, [setOnAddClick]);

  const handleCreateFamily = async (data: CreateFamilyRequest) => {
    setSaving(true);
    try {
      await createFamily(data);
      notificationService.success('Família cadastrada com sucesso!');
      await fetchFamilies();
      setShowCreateModal(false);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setSaving(false);
    }
  };

  const searchHandler = () => {
    const filtered = allFamilies.filter(f =>
      f.responsibleName.toLowerCase().includes(search.trim().toLowerCase())
    );
    setFamilies(filtered);
  };

  if (loading && families.length === 0) return (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="d-flex flex-column">
      <div className="card h-100">
        <div className="p-4 pb-0">
          <SearchBar
            inputPlaceholder='Buscar por responsável...'
            search={search}
            setSearch={setSearch}
            loading={loading}
            onSearch={searchHandler}
            onClear={() => { setSearch(''); setFamilies(allFamilies); }}
            onRefresh={fetchFamilies}
          />
        </div>

        <FamilyTable families={families} onRefresh={fetchFamilies} />
      </div>

      <FamilyCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateFamily}
        loading={saving}
      />
    </div>
  );
};

export default FamiliesPage;
