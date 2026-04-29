import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import FamiliesPage from '../pages/FamiliesPage';
import FamilyMembersPage from '../pages/FamilyMembersPage';
import DonationsPage from '../pages/DonationsPage';
import DeliveriesPage from '../pages/DeliveriesPage';
import ItemsPage from '../pages/ItemsPage';
import ItemDetailPage from '../pages/ItemDetailPage';
import InventoryBatchesPage from '../pages/InventoryBatchesPage';
import ItemCategoriesPage from '../pages/ItemCategoriesPage';
import UsersPage from '../pages/UsersPage';
import LoginPage from '../pages/LoginPage';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/families" element={<FamiliesPage />} />
      <Route path="/families/:familyId/members" element={<FamilyMembersPage />} />
      <Route path="/donations" element={<DonationsPage />} />
      <Route path="/deliveries" element={<DeliveriesPage />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/items/:id" element={<ItemDetailPage />} />
      <Route path="/inventory-batches" element={<InventoryBatchesPage />} />
      <Route path="/item-categories" element={<ItemCategoriesPage />} />
      <Route path="/users" element={<UsersPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
