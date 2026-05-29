import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../reducers';
import { createTree } from './tree';
import Folder, { unPlayedCount } from '../Folder';
import MediaItem from '../MediaItem';
import { nextSelected } from './keyboard';
import './styles.css';

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

const formatFolder = (aFolder) => unPlayedCount(aFolder);

const MediaList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mediaLibrary = useSelector((state) => state.mediaLibrary);
  const [selected, setSelected] = useState(null);

  const { pathname } = useLocation();

  const onPlay = (video) => () => {
    dispatch(play(video));
  };

  const onPlayExp = ({ id }) => () => {
    navigate(`/player/${id}`);
    // console.log(navigate, video);
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

  const tree = useMemo(() => {
    if (mediaLibrary.length) {
      console.log('create tree', mediaLibrary);

      const thetree = createTree(mediaLibrary);

      return thetree;
    }
    return null;
  }, [mediaLibrary]);

  const folder = useMemo(() => {
    if (tree) {
      console.log('set folder', tree);

      const path = pathname
        .split('/')
        .filter((subdir) => subdir !== '')
        .map((val) => decodeURIComponent(val));

      const firstLib = tree[0];
      const target = path.reduce(
        (currentFolder, subFolder) => currentFolder.children.find(
          ({ title }) => title === subFolder,
        ),
        firstLib,
      );

      return formatFolder(target);
    }
    return [];
  }, [tree, pathname]);

  console.log('render');

  useEffect(() => {
    if (folder) {
      const videos = folder.filter(({ video }) => !!video).map(({ video }) => video);

      const withoutThumbnail = videos
        .filter(({ thumbnail }) => !thumbnail);

      const withoutProbe = videos
        .filter(({ probe }) => !probe);

      // affect the same reducer, do after each other
      if (withoutThumbnail.length) {
        dispatch(createThumbnails(withoutThumbnail));
      } else if (withoutProbe.length) {
        dispatch(getProbes(withoutProbe));
      }
    }
  }, [folder, dispatch]);

  useEffect(() => {
    if (selected) {
      document.querySelector(`[data-id="${selected}"]`).scrollIntoView(
        { behavior: 'smooth', block: 'center', inline: 'nearest' },
      );
    }

    // console.log(`[data-id="${selected}"]`);
    // console.log('selected', selected);
  }, [selected]);

  return (
    <div
      className="media-list"
      onKeyDown={onKeyDown}
      role="presentation"
    >
      {
        folder.map((item) => {
          const { children, title, video } = item;

          const isSubFolder = !!children;

          return isSubFolder
            ? (
              <Folder
                folder={item}
                key={title}
                onClick={() => setSelected(title)}
                onFocus={() => setSelected(title)}
                path={join(pathname, title)}
                selected={selected === title}
              />
            )
            : (
              <MediaItem
                key={title}
                onClick={() => setSelected(video.id)}
                onFocus={() => setSelected(video.id)}
                onPlay={onPlay(video)}
                onPlayExp={onPlayExp(video)}
                onTogglePlayed={onTogglePlayed(video)}
                selected={selected === video.id}
                video={video}
              />
            );
        })
      }
    </div>
  );
};

export default MediaList;
