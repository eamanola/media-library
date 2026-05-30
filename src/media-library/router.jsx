import React from 'react';

import { FileBrowser, FrontPage, Player } from './components';

const router = [
  {
    element: <Player />,
    path: 'player/:videoId',
  },
  {
    element: <FrontPage />,
    path: '',
  },
  {
    element: <FileBrowser />,
    path: '*',
  },
];

export default router;
