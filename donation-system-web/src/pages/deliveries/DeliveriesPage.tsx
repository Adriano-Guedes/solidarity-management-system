import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getAllDeliveries } from '../../features/deliveries/deliveryService';
import type { DeliveryResponse } from '../../types/delivery';
import SearchBar from '../../components/SearchBar';
import DeliveryTable from '../../features/deliveries/components/DeliveryTable';
import { notificationService } from '../../utils/toastUtils';

const DeliveriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOnAddClick } = useOutletContext<{ setOnAddClick: (cb: () => void) => void }>();
  const [deliveries, setDeliveries] = useState<DeliveryResponse[]>([]);
  const [allDeliveries, setAllDeliveries] = useState<DeliveryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await getAllDeliveries();
      setDeliveries(data);
      setAllDeliveries(data);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    setOnAddClick(() => () => navigate('/deliveries/create'));
    return () => setOnAddClick(null);
  }, [navigate, setOnAddClick]);

  function searchHandler() {
    const filtered = allDeliveries.filter(f =>
      f.familyResponsibleName.toLowerCase().includes(search.trim().toLowerCase())
    );
    setDeliveries(filtered);
  }

  if (loading && deliveries.length === 0) return (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="d-flex flex-column">
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
    </div>
  );
};

export default DeliveriesPage;
