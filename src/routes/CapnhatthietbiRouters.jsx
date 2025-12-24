import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectRouter from './ProtectRouter';
// render - Danh mục
const DanhmucDonvi = Loadable(lazy(() => import('views/danhmuc/Danhmucdonvi')));
const DanhmucVattu = Loadable(lazy(() => import('views/danhmuc/Danhmucvattu')));

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
              path: 'danhmucvattu',
              element: <DanhmucVattu />
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
