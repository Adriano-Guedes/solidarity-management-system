import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/dashboard/DashboardPage';
import FamiliesPage from '../pages/families/FamiliesPage';
import FamilyDetailPage from '../pages/families/FamilyDetailPage';
import DonationsPage from '../pages/donations/DonationsPage';
import DonationDetailPage from '../pages/donations/DonationDetailPage';
import DeliveriesPage from '../pages/deliveries/DeliveriesPage';
import ItemsPage from '../pages/items/ItemsPage';
import ItemDetailPage from '../pages/items/ItemDetailPage';
import ItemCategoriesPage from '../pages/itemCategories/ItemCategoriesPage';
import ItemCategoryDetailPage from '../pages/itemCategories/ItemCategoryDetailPage';
import UsersPage from '../pages/users/UsersPage';
import LoginPage from '../pages/auth/LoginPage';
import MainLayout from '../layouts/MainLayout';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/families/:id" element={<FamilyDetailPage />} />
        <Route path="/families" element={<FamiliesPage />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/donations/:id" element={<DonationDetailPage />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
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
