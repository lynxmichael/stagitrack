import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Stagiaires from '../pages/Stagiaires';
import Users from '../pages/Users';
import Alertes from '../pages/Alertes';
import NotFound from '../pages/NotFound';

export const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    {/* Routes protégées - tous les utilisateurs connectés */}
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/"           element={<Dashboard />} />
        <Route path="/stagiaires" element={<Stagiaires />} />
        <Route path="/alertes"    element={<Alertes />} />
      </Route>
    </Route>

    {/* Routes admin uniquement */}
    <Route element={<ProtectedRoute adminOnly />}>
      <Route element={<Layout />}>
        <Route path="/users" element={<Users />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);
