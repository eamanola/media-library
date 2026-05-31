import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../reducers';
import Folder, { countUnPlayed } from '../Folder';
import MediaItem from '../MediaItem';
import { nextSelected } from './keyboard';
import './styles.css';
import logger from '../../../logger';

const {
  createThumbnails,
  getProbes,
  togglePlayed,
  play,
} = actions;

const join = (current, subdir) => {
  if (current === '/') return `./${subdir}`;
  return `${current}/${subdir}`;
};

const MediaList = ({ folder = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const thumbnails = useSelector(({ thumbnails: state }) => state);
  const probes = useSelector(({ probes: state }) => state);
  const played = useSelector(({ played: state }) => state);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (folder?.children.length) {
      const updateMeta = async () => {
        const videosWithoutProbe = folder.children
          .filter(({ video }) => !!video)
          .filter(({ video }) => !probes.some(({ path }) => path === video.path));

        if (videosWithoutProbe.length) {
          logger.log('MediaList:', folder.title, 'set probes', videosWithoutProbe.length);
          dispatch(getProbes(videosWithoutProbe.map(({ video }) => video)));
        }
      };
      updateMeta();
    }
  }, [
    dispatch,
    folder,
    probes,
  ]);

  useEffect(() => {
    if (folder?.children.length) {
      const setupThumnails = async () => {
        const videosWithoutThumbnail = folder.children
          .filter(({ video }) => !!video)
          .filter(({ video }) => !thumbnails.some(({ id }) => id === video.id));

        if (videosWithoutThumbnail.length) {
          logger.log('MediaList:', folder.title, 'set thumbnails', videosWithoutThumbnail.length);
          dispatch(createThumbnails(videosWithoutThumbnail.map(({ video }) => video)));
        }
      };
      setupThumnails();
    }
  }, [
    dispatch,
    folder,
    thumbnails,
  ]);

  useEffect(() => {
    if (selected) {
      document.querySelector(`[data-id="${selected}"]`).scrollIntoView(
        { behavior: 'smooth', block: 'center', inline: 'nearest' },
      );
    }
  }, [selected]);

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

      setSelected(next.getAttribute('data-id'));
    }
  };

  if (!folder?.children.length) return null;

  return (
    <div
      className="media-list"
      onKeyDown={onKeyDown}
      role="presentation"
    >
      {
        folder?.children.map((item) => {
          const { children, title, video } = item;

          const isSubFolder = Array.isArray(children);

          return isSubFolder
            ? (
              <Folder
                folder={item}
                key={title}
                onClick={() => setSelected(title)}
                onFocus={() => setSelected(title)}
                path={join(pathname, title)}
                selected={selected === title}
                title={title}
                unPlayed={countUnPlayed(item, played)}
              />
            )
            : (
              <MediaItem
                isPlayed={played.find(({ mediaId }) => video.id === mediaId)?.isPlayed === true}
                key={title}
                onClick={() => setSelected(video.id)}
                onFocus={() => setSelected(video.id)}
                onPlay={onPlay(video)}
                onPlayExp={onPlayExp(video)}
                onTogglePlayed={onTogglePlayed(video)}
                probe={probes.find(({ path }) => path === video.path)?.probe}
                selected={selected === video.id}
                thumbnail={thumbnails.find(({ id }) => id === video.id)?.thumbnail}
                video={video}
              />
            );
        })
      }
    </div>
  );
};

const videoProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
});

const videoItemProps = PropTypes.shape({
  title: PropTypes.string.isRequired,
  video: videoProps.isRequired,
});

let folderProps = null;
folderProps = PropTypes.shape({
  children: PropTypes.arrayOf(PropTypes.oneOf([videoItemProps, folderProps])),
  title: PropTypes.string.isRequired,
});

MediaList.propTypes = {
  folder: folderProps.isRequired,
};

export default MediaList;
