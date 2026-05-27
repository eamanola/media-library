import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import formatTime from './format-time';

const Time = () => {
  const { videoId } = useParams();

  const video = useSelector(
    ({ mediaLibrary }) => (mediaLibrary || []).find(({ id }) => id === videoId),
  );

  const videoEl = document.querySelector('video');

  return (
    <span>
      {formatTime(videoEl.currentTime, videoEl.duration, video.probe?.duration)}
    </span>
  );
};

export default Time;
