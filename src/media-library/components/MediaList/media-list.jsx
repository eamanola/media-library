import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

import { actions } from '../../reducers';
import SubFolder from '../SubFolder';
import MediaItem from '../MediaItem';
import { nextSelected } from './keyboard';
import './styles.css';

const {
  togglePlayed,
  play,
} = actions;

const MediaList = ({ list = null, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODO:
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected) {
      const current = document.querySelector(`[data-selected-id="${selected}"]`);
      current.scrollIntoView(
        { behavior: 'smooth', block: 'center', inline: 'nearest' },
      );
    }
  }, [selected]);

  if (list === null) return null;

  const onPlay = (video) => () => {
    dispatch(play(video));
  };

  const onPlayExp = ({ id }) => () => {
    navigate(`/player/${id}`);
  };

  const onTogglePlayed = (video) => () => {
    dispatch(togglePlayed(video));
  };

  const onKeyDown = (e) => {
    const next = nextSelected(e);
    if (next) {
      e.preventDefault();
      e.stopPropagation();

      setSelected(next.getAttribute('data-selected-id'));
    }
  };
  return (
    <>
      <h4>
        {title}
      </h4>

      <div
        className="media-list"
        onKeyDown={onKeyDown}
        role="presentation"
      >
        {
          list.map((item) => (item.isSubFolder
            ? (
              <SubFolder
                key={item.title}
                // onClick={() => setSelected(item.title)}
                // onFocus={() => setSelected(item.title)}
                path={item.path}
                selected={selected === item.title}
                selectedId={item.title}
                title={item.title}
                unPlayed={item.unPlayed}
              />
            )
            : (
              <MediaItem
                duration={item.duration}
                hasProbe={item.hasProbe}
                isPlayed={item.isPlayed}
                key={item.video.id}
                onClick={() => setSelected(item.video.id)}
                // onFocus={() => setSelected(item.video.id)}
                onPlay={onPlay(item.video)}
                onPlayExp={onPlayExp(item.video)}
                onTogglePlayed={onTogglePlayed(item.video)}
                selected={selected === item.video.id}
                selectedId={item.video.id}
                thumbnail={item.thumbnail}
                video={item.video}
              />
            )
          ))
        }
      </div>
    </>
  );
};

MediaList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.oneOf([
    PropTypes.shape({
      isSubFolder: PropTypes.bool.isRequired,
      path: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      unPlayed: PropTypes.number.isRequired,
    }),
    PropTypes.shape({
      duration: PropTypes.number,
      hasProbe: PropTypes.bool,
      isPlayed: PropTypes.bool,
      isSubFolder: PropTypes.bool.isRequired,
      thumbnail: PropTypes.string,
      title: PropTypes.string.isRequired,
      video: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    }),
  ])),
  title: PropTypes.string.isRequired,
};

MediaList.defaultProps = {
  list: null,
};

export default MediaList;
