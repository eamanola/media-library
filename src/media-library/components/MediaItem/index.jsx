import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import secondsToTimeStr from './seconds-to-timestr';

import './styles.css';

const printTitle = ({
  title, season = null, episode = null, extra = null,
}) => [title, season ? `S${season}` : '', (typeof episode === 'number') ? `${extra || 'E'}${episode}` : '']
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
      role="presentation"
      onClick={onClick}
    >
      <div
        className="media-item-image-container"
        role="presentation"
        onClick={video.probe ? onPlayExp : onPlay}
      >
        {
          video.thumbnail
            ? <img src={video.thumbnail} alt={video.id} />
            : <div>{video.id}</div>
        }
      </div>

      <div className="media-item-title">
        {printTitle(video)}
      </div>

      <div className="media-item-duration">
        {video.probe?.duration ? secondsToTimeStr(video.probe.duration) : '-'}
      </div>

      <button
        ref={playRef}
        className="media-item-play-button"
        type="button"
        onClick={onPlay}
        onFocus={onFocus}
      >
        Play
      </button>

      <label
        htmlFor={`played-${video.id}`}
        className="media-item-played-label"
      >
        <input
          ref={playedRef}
          id={`played-${video.id}`}
          type="checkbox"
          checked={video.played?.isPlayed === true}
          onChange={onTogglePlayed}
          onFocus={onFocus}
        />
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
    probe: PropTypes.shape({
      duration: PropTypes.number.isRequired,
    }),
    episode: PropTypes.number,
    extra: PropTypes.string,
    id: PropTypes.string.isRequired,
    played: PropTypes.shape({
      isPlayed: PropTypes.bool.isRequired,
    }),
    season: PropTypes.number,
    thumbnail: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
export default MediaItem;
