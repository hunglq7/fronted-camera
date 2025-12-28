import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectRouter from '../routes/ProtectRouter';
// render - dashboard pages
const DefaultPages = Loadable(lazy(() => import('views/navigation/dashboard/Default')));
const LoginPages = Loadable(lazy(() => import('views/auth/login/Login')));
// ==============================|| NAVIGATION ROUTING ||============================== //

const NavigationRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <ProtectRouter>
          <DashboardLayout />
        </ProtectRouter>
      ),
      children: [
        {
          path: '/',
          element: <DefaultPages />
        }
      ]
    }
  ]
};

export default NavigationRoutes;
