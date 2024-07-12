import React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import { router as usersRouter } from './users';
import { router as emailVerificationRouter } from './email-verification';
import { router as mediaLibraryRouter } from './media-library';

const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      ...usersRouter,
      ...emailVerificationRouter,
      ...mediaLibraryRouter,
    ],
  },
]);

export default router;
