import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PublicRequestFormPage from './pages/public/RequestFormPage';
import RequestSuccessPage from './pages/public/RequestSuccessPage';
import DashboardPage from './pages/admin/DashboardPage';
import RequestsListPage from './pages/admin/RequestsListPage';
import AdminRequestFormPage from './pages/admin/RequestFormPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/request" replace />} />

        <Route element={<PublicLayout />}>
          <Route path="/request" element={<PublicRequestFormPage />} />
          <Route path="/request/success" element={<RequestSuccessPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="requests" element={<RequestsListPage />} />
          <Route path="requests/new" element={<AdminRequestFormPage />} />
          <Route path="requests/:id/edit" element={<AdminRequestFormPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
