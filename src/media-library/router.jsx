import React from 'react';
import MediaList from './components/MediaList';
import Player from './components/Player';

const router = [
  {
    path: 'player/:videoId',
    element: <Player />,
  },
  {
    path: '',
    element: <MediaList />,
  },
  {
    path: '*',
    element: <MediaList />,
  },
];

export default router;
