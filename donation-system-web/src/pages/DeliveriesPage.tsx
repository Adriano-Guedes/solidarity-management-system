import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getAllDeliveries } from '../features/deliveries/deliveryService';
import type { DeliveryResponse } from '../types/delivery';
import SearchBar from '../components/SearchBar';
import DeliveryTable from '../features/deliveries/components/DeliveryTable';

const DeliveriesPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryResponse[]>([]);
  const [allDeliveries, setAllDeliveries] = useState<DeliveryResponse[]>([]); // lista completa para filtro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  // Busca na API
  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDeliveries();
      setDeliveries(data);
      setAllDeliveries(data);
    } catch {
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    // eslint-disable-next-line
  }, []);


  // Funções auxiliares dentro do componente
  function searchHandler() {
    if (!search.trim()) return;
    setSearching(true);
    const filtered = allDeliveries.filter(f =>
      f.familyResponsableName.toLowerCase().includes(search.trim().toLowerCase())
    );
    setDeliveries(filtered);
    setSearching(false);
  }

  function clearHandler() {
    setSearch('');
    setDeliveries(allDeliveries);
  }

  function refreshHandler() {
    setSearch('');
    fetchDeliveries();
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
          <h1 style={{ color: '#0B1F3A' }}>Entregas</h1>
          {/* Barra de busca */}
          <SearchBar
            inputPlaceholder='Buscar por responsável da família...'
            search={search}
            setSearch={setSearch}
            loading={loading}
            onSearch={searchHandler}
            onClear={clearHandler}
            onRefresh={refreshHandler}
          />
          <DeliveryTable deliveries={deliveries} />
        </div>
      </main>
    </div>
  );
};

export default DeliveriesPage;
