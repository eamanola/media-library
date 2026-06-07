import React from 'react';

import './progress.css';

const secToWidth = (sec, max) => `${Math.round((sec / max) * 100)}%`;

const getBuffers = (timeRangeArr, duration) => {
  const buffers = [];

  for (let i = 0; i < timeRangeArr.length; i += 1) {
    const start = timeRangeArr.start(i);
    const end = timeRangeArr.end(i);
    const left = secToWidth(start, duration);
    const width = secToWidth(end - start, duration);

    if (width !== '0%') {
      buffers.push({ left, width });
    }
  }

  return buffers;
};

const Progress = ({
  abuffered = null,
  buffered = null,
  currentTime = 0,
  duration = 0,
  onSeekTo = null,
}) => {
  const buffers = buffered?.length > 0 ? getBuffers(buffered, duration) : [];
  const abuffers = abuffered?.length > 0 ? getBuffers(abuffered, duration) : [];

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { nativeEvent } = e;

    const { offsetX: x } = nativeEvent;

    const progressBar = document.querySelector('.progress');
    const maxWidth = progressBar.offsetWidth;

    onSeekTo((x / maxWidth) * duration);
  };

  return (
    <div className="progress" onClick={onSeekTo ? onClick : null}>
      <div className="available" />

      {
        buffers.map(({ left, width }) => (
          <div className="buffered" key={`key-${left}-${width}`} style={{ left, width }} />
        ))
      }

      {
        abuffers.map(({ left, width }) => (
          <div className="abuffered" key={`key-${left}-${width}`} style={{ left, width }} />
        ))
      }

      <div className="played" style={{ width: secToWidth(currentTime, duration) }} />

      <div className="click-stealer">
        {' '}
      </div>
    </div>
  );
};

export default Progress;
