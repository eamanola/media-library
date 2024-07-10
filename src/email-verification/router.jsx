import React from 'react';

import VerifiedByLink from './pages/VerifiedByLink';
import VerifyByCode from './pages/VerifyByCode';

const router = [
  {
    path: 'email/verify/by-link/:status',
    element: <VerifiedByLink />,
  },
  {
    path: 'email/verify/by-code',
    element: <VerifyByCode />,
  },
];

export default router;
