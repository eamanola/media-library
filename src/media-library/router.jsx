import React from 'react';
import MediaList from './components/MediaList';

const router = [
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
