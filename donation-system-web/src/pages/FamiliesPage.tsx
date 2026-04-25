import React, { useEffect, useState } from 'react';
import { getAllFamilies } from '../features/families/familyService';
import FamilyTable from '../features/families/FamilyTable';
import type { FamilyResponse } from '../types/family';

const FamiliesPage: React.FC = () => {
  const [families, setFamilies] = useState<FamilyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllFamilies()
      .then(setFamilies)
      .catch(() => setError('Failed to fetch families'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Families</h1>
      <FamilyTable families={families} />
    </div>
  );
};

export default FamiliesPage;
