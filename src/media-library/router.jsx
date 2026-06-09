import React from 'react';

import { FileBrowser, FrontPage, Player } from './components';
import { PATH_PLAYER } from './config';

const router = [
  {
    element: <Player />,
    path: `${PATH_PLAYER}/*`,
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
