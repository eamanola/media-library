import React from 'react';

import { LoginPage, SignupPage } from './pages';

const router = [
  {
    element: <LoginPage />,
    path: '/login',
  },
  {
    element: <SignupPage />,
    path: '/signup',
  },
];

export default router;
