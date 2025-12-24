import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - dashboard pages

const LoginPages = Loadable(lazy(() => import('views/auth/login/login')));
// ==============================|| NAVIGATION ROUTING ||============================== //

const NavigationRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <LoginPages />
    }
  ]
};

export default NavigationRoutes;
