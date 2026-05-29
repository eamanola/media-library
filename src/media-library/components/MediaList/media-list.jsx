import React, { useEffect, useState } from 'react';
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

  const mediaLibrary = useSelector(({ mediaLibrary: state }) => state);
  const thumbnails = useSelector(({ thumbnails: state }) => state);
  const probes = useSelector(({ probes: state }) => state);
  const [selected, setSelected] = useState(null);
  const [tree, setTree] = useState(null);
  const [folder, setFolder] = useState([]);

  const { pathname } = useLocation();

  useEffect(() => {
    if (mediaLibrary.length) {
      const updateTree = async () => {
        console.log('create tree', mediaLibrary);

        const thetree = createTree(mediaLibrary);

        setTree(thetree);
      };
      updateTree();
    }
  }, [mediaLibrary]);

  useEffect(() => {
    if (tree) {
      const updateFolder = async () => {
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

        setFolder(formatFolder(target));
      };
      updateFolder();
    }
  }, [tree, pathname]);

  useEffect(() => {
    if (folder.length) {
      const updateMeta = async () => {
        const videos = folder.filter(({ video }) => !!video).map(({ video }) => video);

        const withoutProbe = videos.filter(
          ({ path }) => !probes.find(({ path: probePath }) => probePath === path),
        );

        if (withoutProbe.length) {
          console.log('update probes', withoutProbe);
          await dispatch(getProbes(withoutProbe));
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
    if (folder.length) {
      const videos = folder.filter(({ video }) => !!video).map(({ video }) => video);
      const withoutThumbnail = videos.filter(
        ({ id }) => !thumbnails.find(({ id: videoId }) => videoId === id),
      );
      if (withoutThumbnail.length) {
        console.log('update thumbnails', withoutThumbnail);
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
