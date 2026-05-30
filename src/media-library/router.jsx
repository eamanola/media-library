import React from 'react';

import { Browser, Player } from './components';

const router = [
  {
    element: <Player />,
    path: 'player/:videoId',
  },
  {
    element: <Browser />,
    path: '',
  },
  {
    element: <Browser />,
    path: '*',
  },
];

export default router;
