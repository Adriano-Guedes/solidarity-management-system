import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import DonationTable from '../features/donations/components/DonationTable';
import { getAllDonations } from '../features/donations/donationService';
import type { DonationResponse } from '../types/donation';

const DonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<DonationResponse[]>([]);
  const [allDonations, setAllDonations] = useState<DonationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  // Busca na API
  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDonations();
      setDonations(data);
      setAllDonations(data);
    } catch {
      setError('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
    // eslint-disable-next-line
  }, []);

  function searchHandler() {
    if (!search.trim()) return;
    setSearching(true);
    const filtered = allDonations.filter(donation =>
      donation.createdBy.toLowerCase().includes(search.trim().toLowerCase())
    );
    setDonations(filtered);
    setSearching(false);
  }

  function clearHandler() {
    setSearch('');
    setDonations(allDonations);
  }

  function refreshHandler() {
    setSearch('');
    fetchDonations();
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
          <h1 style={{ color: '#0B1F3A' }}>Doações Recebidas</h1>
          <SearchBar
            inputPlaceholder='Buscar por responsável...'
            search={search}
            setSearch={setSearch}
            loading={loading}
            onSearch={searchHandler}
            onAdd={() => {}}
            onClear={clearHandler}
            onRefresh={refreshHandler}
          />
          <DonationTable donations={donations} />
        </div>
      </main>
    </div>
  );
};

export default DonationsPage;
