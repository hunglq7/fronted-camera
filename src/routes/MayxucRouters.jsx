import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectRouter from './ProtectRouter';
// render - chart pages
const FormCapnhatmayxuc = Loadable(lazy(() => import('views/mayxuc/Capnhatmayxuc')));

// render - map pages
// const GoogleMaps = Loadable(lazy(() => import('views/maps/GoogleMap')));

// ==============================|| CHART & MAP ROUTING ||============================== //

const MayxucRouters = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'mayxuc',
          children: [
            {
              path: 'capnhatmayxuc',
              element: <FormCapnhatmayxuc />
            }
          ]
        }
        // {
        //   path: 'map',
        //   children: [
        //     {
        //       path: 'google-map',
        //       element: <GoogleMaps />
        //     }
        //   ]
        // }
      ]
    }
  ]
};

export default MayxucRouters;
