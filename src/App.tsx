import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import AppointmentsPage from './pages/dashboard/AppointmentsPage';
import PatientsPage from './pages/dashboard/PatientsPage';
import PatientProfilePage from './pages/dashboard/PatientProfilePage';
import ServicesPage from './pages/dashboard/ServicesPage';
import BillingPage from './pages/dashboard/BillingPage';
import SupportPage from './pages/dashboard/SupportPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="dashboard/appointments" element={<AppointmentsPage />} />
          <Route path="dashboard/patients" element={<PatientsPage />} />
          <Route path="dashboard/patients/:id" element={<PatientProfilePage />} />
          <Route path="dashboard/services" element={<ServicesPage />} />
          <Route path="dashboard/billing" element={<BillingPage />} />
          <Route path="dashboard/support" element={<SupportPage />} />
          <Route path="dashboard/settings" element={<SettingsPage />} />
        </Route>

        {/* Redirect all other routes to dashboard home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
