import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - chart pages
const FormCapnhatmaycao = Loadable(lazy(() => import('views/maycao/Capnhatmaycao')));
const FormDanhmucmaycao = Loadable(lazy(() => import('views/maycao/Danhmucmaycao')));
// render - map pages
// const GoogleMaps = Loadable(lazy(() => import('views/maps/GoogleMap')));

// ==============================|| CHART & MAP ROUTING ||============================== //

const MaycaoRouters = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'maycao',
          children: [
            {
              path: 'capnhatmaycao',
              element: <FormCapnhatmaycao />
            },
            {
              path: 'danhmucmaycao',
              element: <FormDanhmucmaycao />
            }
          ]
        }
      ]
    }
  ]
};

export default MaycaoRouters;
