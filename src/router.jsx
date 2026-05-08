import React from 'react';
import { createBrowserRouter } from 'react-router';

import App from './App.jsx';
import { router as usersRouter } from './users';
import { router as emailVerificationRouter } from './email-verification';
import { router as mediaLibraryRouter } from './media-library';

const router = createBrowserRouter([
  {
    children: [
      ...usersRouter,
      ...emailVerificationRouter,
      ...mediaLibraryRouter,
    ],
    element: <App />,
    path: '',
  },
]);

export default router;
