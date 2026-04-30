import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import DonationTable from '../features/donations/components/DonationTable';
import DonationCreateModal from '../features/donations/components/DonationCreateModal';
import { getAllDonations, createDonation } from '../features/donations/donationService';
import type { DonationResponse, CreateDonationRequest } from '../types/donation';
import { notificationService } from '../utils/toastUtils';

interface ContextType {
  setOnAddClick: (fn: (() => void) | null) => void;
}

const DonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<DonationResponse[]>([]);
  const [allDonations, setAllDonations] = useState<DonationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { setOnAddClick } = useOutletContext<ContextType>();

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await getAllDonations();
      setDonations(data);
      setAllDonations(data);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    setOnAddClick(() => () => setShowCreateModal(true));
    return () => setOnAddClick(null);
  }, [setOnAddClick]);

  async function handleCreateDonation(data: CreateDonationRequest) {
    setSaving(true);
    try {
      await createDonation(data);
      notificationService.success('Doação registrada com sucesso!');
      await fetchDonations();
      setShowCreateModal(false);
    } catch (err) {
      notificationService.error(err);
    } finally {
      setSaving(false);
    }
  }

  function searchHandler() {
    const filtered = allDonations.filter(donation =>
      donation.createdByName.toLowerCase().includes(search.trim().toLowerCase())
    );
    setDonations(filtered);
  }

  if (loading && donations.length === 0) return (
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
            onClear={() => { setSearch(''); setDonations(allDonations); }}
            onRefresh={fetchDonations}
          />
        </div>
        
        <DonationTable donations={donations} />
      </div>

      <DonationCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateDonation}
        loading={saving}
      />
    </div>
  );
};

export default DonationsPage;
