import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectRouter from './ProtectRouter';
// render - Danh mục
const DanhmucDonvi = Loadable(lazy(() => import('views/danhmuc/Danhmucdonvi')));
const DanhmucThietbi = Loadable(lazy(() => import('views/danhmuc/Danhmucthietbi')));
const DanhmucKhuvuc = Loadable(lazy(() => import('views/danhmuc/Danhmuckhuvuc')));
// render - Cạp nhật thiết bị
const CapnhatCamera = Loadable(lazy(() => import('views/thietbi/CapnhatCamera')));

// ==============================|| CHART & MAP ROUTING ||============================== //

const CapnhatthietbiRouters = {
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
          path: 'danhmuc',
          children: [
            {
              path: 'danhmucdonvi',
              element: <DanhmucDonvi />
            },
            {
              path: 'danhmucthietbi',
              element: <DanhmucThietbi />
            },
            {
              path: 'danhmuckhuvuc',
              element: <DanhmucKhuvuc />
            }
          ]
        },
        {
          path: 'thietbi',
          children: [
            {
              path: 'capnhatcamera',
              element: <CapnhatCamera />
            }
          ]
        }
      ]
    }
  ]
};

export default CapnhatthietbiRouters;
