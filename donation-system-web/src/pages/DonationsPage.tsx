import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import DonationTable from '../features/donations/components/DonationTable';
import { getAllDonations } from '../features/donations/donationService';
import type { DonationResponse } from '../types/donation';
import { FiFilter, FiDownload } from 'react-icons/fi';

const DonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<DonationResponse[]>([]);
  const [allDonations, setAllDonations] = useState<DonationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDonations();
      setDonations(data);
      setAllDonations(data);
    } catch {
      setError('Erro ao carregar doações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  function searchHandler() {
    const filtered = allDonations.filter(donation =>
      donation.createdBy.toLowerCase().includes(search.trim().toLowerCase())
    );
    setDonations(filtered);
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
          inputPlaceholder='Buscar por responsável...'
          search={search}
          setSearch={setSearch}
          loading={loading}
          onSearch={searchHandler}
          onClear={() => { setSearch(''); setDonations(allDonations); }}
          onRefresh={fetchDonations}
        />
      </div>
      
      <DonationTable donations={donations} />
    </div>
  );
};

export default DonationsPage;
