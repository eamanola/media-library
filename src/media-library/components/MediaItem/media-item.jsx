import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import secondsToTimeStr from './seconds-to-timestr';

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
  onClick,
  // onFocus,
  onPlay,
  onPlayExp,
  onTogglePlayed,
  isPlayed = false,
  hasProbe = false,
  duration = 0,
  selected,
  selectedId,
  thumbnail = null,
  video,
}) => {
  const playRef = useRef(null);
  const playedRef = useRef(null);

  useEffect(() => {
    if (selected && document.activeElement !== playedRef.current) {
      playRef.current.focus();
    }
  }, [selected]);

  return (
    <div
      className={`media-item ${selected ? 'selected' : ''}`}
      data-selected-id={selectedId}
      onClick={onClick}
      role="presentation"
    >
      <div
        className="media-item-image-container"
        onClick={hasProbe ? onPlayExp : onPlay}
        role="presentation"
      >
        {
          thumbnail
            ? <img alt={video.id} src={thumbnail} />
            : (
              <div>
                {video.id}
              </div>
            )
        }

      </div>

      <div className="media-item-title">
        {printTitle(video)}
      </div>

      <div className="media-item-duration">
        {duration ? secondsToTimeStr(duration) : '-'}
      </div>

      <button
        className="media-item-play-button"
        onClick={onPlay}
        // onFocus={onFocus}
        ref={playRef}
        type="button"
      >
        Play
      </button>

      <label
        className="media-item-played-label"
        htmlFor={`played-${video.id}`}
      >
        <input
          checked={isPlayed === true}
          id={`played-${video.id}`}
          onChange={onTogglePlayed}
          // onFocus={onFocus}
          ref={playedRef}
          type="checkbox"
        />

        {' '}

        Played

      </label>
    </div>
  );
};

MediaItem.propTypes = {
  duration: PropTypes.number,
  hasProbe: PropTypes.func,
  isPlayed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  // onFocus: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPlayExp: PropTypes.func.isRequired,
  onTogglePlayed: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  selectedId: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  video: PropTypes.shape({
    episode: PropTypes.number,
    extra: PropTypes.string,
    id: PropTypes.string.isRequired,
    season: PropTypes.number,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

MediaItem.defaultProps = {
  duration: 0,
  hasProbe: false,
  isPlayed: false,
  thumbnail: null,
};

export default MediaItem;
