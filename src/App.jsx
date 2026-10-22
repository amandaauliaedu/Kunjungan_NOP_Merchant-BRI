import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './hooks/useData.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home.jsx';
import LiveResponse from './pages/LiveResponse.jsx';
import Dashboard from './pages/Dashboard.jsx';
export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/live-response" element={<LiveResponse />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}
