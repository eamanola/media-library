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
  onFocus,
  onPlay,
  onPlayExp,
  onTogglePlayed,
  probe = null,
  selected,
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
      data-id={video.id}
      onClick={onClick}
      role="presentation"
    >
      <div
        className="media-item-image-container"
        onClick={probe ? onPlayExp : onPlay}
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
        {probe?.duration ? secondsToTimeStr(probe.duration) : '-'}
      </div>

      <button
        className="media-item-play-button"
        onClick={onPlay}
        onFocus={onFocus}
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
          checked={video.played?.isPlayed === true}
          id={`played-${video.id}`}
          onChange={onTogglePlayed}
          onFocus={onFocus}
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
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPlayExp: PropTypes.func.isRequired,
  onTogglePlayed: PropTypes.func.isRequired,
  probe: PropTypes.shape({
    duration: PropTypes.number.isRequired,
  }),
  selected: PropTypes.bool.isRequired,
  thumbnail: PropTypes.string,
  video: PropTypes.shape({
    episode: PropTypes.number,
    extra: PropTypes.string,
    id: PropTypes.string.isRequired,
    played: PropTypes.shape({
      isPlayed: PropTypes.bool.isRequired,
    }),
    season: PropTypes.number,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

MediaItem.defaultProps = {
  probe: null,
  thumbnail: null,
};

export default MediaItem;
