import React from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const router = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
];

export default router;
