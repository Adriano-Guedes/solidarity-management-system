import React, { useEffect, useState } from 'react';
import { getAllFamilies } from '../features/families/familyService';
import FamilyTable from '../features/families/components/FamilyTable';
import type { FamilyResponse } from '../types/family';
import SearchBar from '../components/SearchBar';
import { FiFilter, FiDownload } from 'react-icons/fi';

const FamiliesPage: React.FC = () => {
  const [families, setFamilies] = useState<FamilyResponse[]>([]);
  const [allFamilies, setAllFamilies] = useState<FamilyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const data = await getAllFamilies();
      setFamilies(data);
      setAllFamilies(data);
    } catch {
      setError('Erro ao carregar famílias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const searchHandler = () => {
    const filtered = allFamilies.filter(f =>
      f.responsibleName.toLowerCase().includes(search.trim().toLowerCase())
    );
    setFamilies(filtered);
  };

  if (loading) return (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
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

      <FamilyTable families={families} />
    </div>
  );
};

export default FamiliesPage;
