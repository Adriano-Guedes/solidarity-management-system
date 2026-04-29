import React, { useEffect, useState } from 'react';
import { getAllDeliveries } from '../features/deliveries/deliveryService';
import type { DeliveryResponse } from '../types/delivery';
import SearchBar from '../components/SearchBar';
import DeliveryTable from '../features/deliveries/components/DeliveryTable';
import { FiFilter, FiDownload } from 'react-icons/fi';

const DeliveriesPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryResponse[]>([]);
  const [allDeliveries, setAllDeliveries] = useState<DeliveryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDeliveries();
      setDeliveries(data);
      setAllDeliveries(data);
    } catch {
      setError('Erro ao carregar entregas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  function searchHandler() {
    const filtered = allDeliveries.filter(f =>
      f.familyResponsableName.toLowerCase().includes(search.trim().toLowerCase())
    );
    setDeliveries(filtered);
  }

  if (loading) return (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="card h-100">
      <div className="p-4 pb-0">
        <SearchBar
          inputPlaceholder='Buscar por responsável da família...'
          search={search}
          setSearch={setSearch}
          loading={loading}
          onSearch={searchHandler}
          onClear={() => { setSearch(''); setDeliveries(allDeliveries); }}
          onRefresh={fetchDeliveries}
        />
      </div>

      <DeliveryTable deliveries={deliveries} />
    </div>
  );
};

export default DeliveriesPage;
