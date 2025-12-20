import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './router/router.jsx';
import 'aos/dist/aos.css';
import Aos from 'aos';
import AuthProvider from './contexts/AuthContext/AuthProvider.jsx';
import { ToastContainer } from 'react-toastify';

Aos.init();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer/>
    </AuthProvider>
  </StrictMode>,
)
