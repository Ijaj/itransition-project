import React from 'react';
import ReactDOM from 'react-dom/client';

import { activeRoutes } from './routes';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AlertProvider } from './components/Alert';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AlertProvider>
      <RouterProvider router={activeRoutes} />
    </AlertProvider>
  </React.StrictMode>
);
