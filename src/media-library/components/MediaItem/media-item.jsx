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
  selected,
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
        onClick={video.probe ? onPlayExp : onPlay}
        role="presentation"
      >
        {
          video.thumbnail
            ? <img alt={video.id} src={video.thumbnail} />
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
        {video.probe?.duration ? secondsToTimeStr(video.probe.duration) : '-'}
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
  selected: PropTypes.bool.isRequired,
  video: PropTypes.shape({
    episode: PropTypes.number,
    extra: PropTypes.string,
    id: PropTypes.string.isRequired,
    played: PropTypes.shape({
      isPlayed: PropTypes.bool.isRequired,
    }),
    probe: PropTypes.shape({
      duration: PropTypes.number.isRequired,
    }),
    season: PropTypes.number,
    thumbnail: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
export default MediaItem;
