import React from 'react';

import { MediaList, Player } from './components';

const router = [
  {
    element: <Player />,
    path: 'player/:videoId',
  },
  {
    element: <MediaList />,
    path: '',
  },
  {
    element: <MediaList />,
    path: '*',
  },
];

export default router;
