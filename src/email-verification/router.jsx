import React from 'react';

import { VerifiedByLink, VerifyByCode } from './pages';

const router = [
  {
    element: <VerifiedByLink />,
    path: 'email/verify/by-link/:status',
  },
  {
    element: <VerifyByCode />,
    path: 'email/verify/by-code',
  },
];

export default router;
