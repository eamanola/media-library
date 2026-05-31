import React from 'react';

import './progress.css';

const secToWidth = (sec, max) => `${Math.round((sec / max) * 100)}%`;

const Progress = ({
  buffered = null,
  currentTime = 0,
  duration = 0,
  onSeekTo = null,
}) => {
  const buffers = [];
  if (buffered?.length > 0) {
    for (let i = 0; i < buffered.length; i += 1) {
      const start = buffered.start(i);
      const end = buffered.end(i);
      const left = secToWidth(start, duration);
      const width = secToWidth(end - start, duration);

      if (width !== '0%') {
        buffers.push({ left, width });
      }
    }
  }

  const onClick = (e) => {
    const { nativeEvent } = e;

    const { offsetX: x } = nativeEvent;

    const progressBar = document.querySelector('.progress > .available');
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

      <div className="played" style={{ width: secToWidth(currentTime, duration) }} />
    </div>
  );
};

export default Progress;
