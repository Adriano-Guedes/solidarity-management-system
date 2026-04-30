import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import FamiliesPage from '../pages/FamiliesPage';
import FamilyMembersPage from '../pages/FamilyMembersPage';
import DonationsPage from '../pages/DonationsPage';
import DonationDetailPage from '../pages/DonationDetailPage';
import DeliveriesPage from '../pages/DeliveriesPage';
import ItemsPage from '../pages/ItemsPage';
import ItemDetailPage from '../pages/ItemDetailPage';
import InventoryBatchesPage from '../pages/InventoryBatchesPage';
import ItemCategoriesPage from '../pages/ItemCategoriesPage';
import ItemCategoryDetailPage from '../pages/ItemCategoryDetailPage';
import UsersPage from '../pages/UsersPage';
import LoginPage from '../pages/LoginPage';
import MainLayout from '../layouts/MainLayout';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Protected Routes with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/families" element={<FamiliesPage />} />
        <Route path="/families/:familyId/members" element={<FamilyMembersPage />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/donations/:id" element={<DonationDetailPage />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/inventory-batches" element={<InventoryBatchesPage />} />
        <Route path="/item-categories" element={<ItemCategoriesPage />} />
        <Route path="/item-categories/:id" element={<ItemCategoryDetailPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      {/* Redirect unknown routes to dashboard or login */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
