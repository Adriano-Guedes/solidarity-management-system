import React from 'react';
import type { FamilyResponse } from '../../types/family';

interface FamilyTableProps {
  families: FamilyResponse[];
}

const FamilyTable: React.FC<FamilyTableProps> = ({ families }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Responsible Name</th>
          <th>Document</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Monthly Income</th>
          <th>Active</th>
          <th>Created At</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {families.map(family => (
          <tr key={family.id}>
            <td>{family.responsibleName}</td>
            <td>{family.responsibleDocument || '-'}</td>
            <td>{family.phoneNumber || '-'}</td>
            <td>{family.address || '-'}</td>
            <td>{family.monthlyIncome != null ? family.monthlyIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '-'}</td>
            <td>{family.active ? 'Yes' : 'No'}</td>
            <td>{new Date(family.createdAt).toLocaleDateString()}</td>
            <td>{family.notes || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FamilyTable;
