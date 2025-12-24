import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';

// render - forms element pages
const FormBasic = Loadable(lazy(() => import('views/forms/form-element/FormBasic')));
const FormAdvan = Loadable(lazy(() => import('views/forms/form-element/FormAdvan')));

// ==============================|| FORMS ROUTING ||============================== //

const FormsRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'forms',
          children: [
            {
              path: 'form-elements',
              children: [
                { path: 'basic', element: <FormBasic /> },
                { path: 'advan', element: <FormAdvan /> },
                { path: 'mayxuc', element: <FormAdvan /> }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default FormsRoutes;
