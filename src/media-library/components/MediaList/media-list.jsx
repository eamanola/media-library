import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../reducers';
import { createTree } from './tree';
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

const MediaList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mediaLibrary = useSelector(({ mediaLibrary: state }) => state);
  const thumbnails = useSelector(({ thumbnails: state }) => state);
  const probes = useSelector(({ probes: state }) => state);
  const played = useSelector(({ played: state }) => state);
  const [selected, setSelected] = useState(null);
  const [tree, setTree] = useState(null);
  const [folder, setFolder] = useState(null);

  const { pathname } = useLocation();

  useEffect(() => {
    if (mediaLibrary.length) {
      const updateTree = async () => {
        const thetree = createTree(mediaLibrary);

        setTree(thetree);
      };
      updateTree();
    }
  }, [mediaLibrary]);

  useEffect(() => {
    if (tree) {
      const updateFolder = async () => {
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

        setFolder(target);
      };
      updateFolder();
    }
  }, [tree, pathname]);

  useEffect(() => {
    if (folder?.children.length) {
      const updateMeta = async () => {
        const videos = folder.children.filter(({ video }) => !!video).map(({ video }) => video);

        const withoutProbe = videos.filter(
          ({ path }) => !probes.find(({ path: probePath }) => probePath === path),
        );

        if (withoutProbe.length) {
          dispatch(getProbes(withoutProbe));
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
      const videos = folder.children.filter(({ video }) => !!video).map(({ video }) => video);
      const withoutThumbnail = videos.filter(
        ({ id }) => !thumbnails.find(({ id: videoId }) => videoId === id),
      );
      if (withoutThumbnail.length) {
        dispatch(createThumbnails(withoutThumbnail));
      }
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

  useEffect(() => {
    logger.log('set media lib', mediaLibrary);
  }, [mediaLibrary]);

  useEffect(() => {
    logger.log('set tree', tree);
  }, [tree]);

  useEffect(() => {
    logger.log('set folder', folder);
  }, [folder]);

  useEffect(() => {
    logger.log('set thumbnails', thumbnails);
  }, [thumbnails]);

  useEffect(() => {
    logger.log('set probes', probes);
  }, [probes]);

  useEffect(() => {
    logger.log('set played', played);
  }, [played]);

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

export default MediaList;
