import React from 'react';

import secondsToTimeStr from './seconds-to-timestr';
import ImageButton from '../ImageButton';

import './styles.css';

const printTitle = ({
  title, season = null, episode = null, extra = null,
}) => [
  title,
  season ? `S${season}` : '',
  (typeof episode === 'number') ? `${extra || 'E'}${episode}` : '',
]
  .filter((element) => element !== '')
  .join(' ');

const MediaItem = ({
  onFocus,
  onPlay,
  onPlayExp,
  onTogglePlayed,
  onKeyDown,
  isPlayed = false,
  hasProbe = false,
  duration = 0,
  selectedId,
  thumbnail = null,
  video,
}) => {
  const onFocusLocal = (e) => {
    if (e.target.className === 'media-item') {
      e.target.querySelector('.media-item-image-button').focus();
    }

    if (onFocus) {
      onFocus(e);
    }
  };

  return (
    <div
      className="media-item"
      data-selected-id={selectedId}
      onFocus={onFocusLocal}
      onKeyDown={onKeyDown}
      role="presentation"
      tabIndex={-1}
    >

      <ImageButton
        alt={video.displayId}
        classNames="media-item-image-button"
        onClick={hasProbe ? onPlayExp : onPlay}
        role="presentation"
        src={thumbnail}
      />

      <div className="media-item-title">
        {printTitle(video)}
      </div>

      <div className="media-item-duration">
        {duration ? secondsToTimeStr(duration) : '-'}
      </div>

      <button
        className="media-item-play-button"
        onClick={onPlay}
        onFocus={onFocus}
        type="button"
      >
        Play
      </button>

      <label
        className="media-item-played-label"
        htmlFor={`played-${video.displayId}`}
      >
        <input
          checked={isPlayed === true}
          id={`played-${video.displayId}`}
          onChange={onTogglePlayed}
          onFocus={onFocus}
          type="checkbox"
        />

        {' '}

        Played

      </label>
    </div>
  );
};

export default MediaItem;
