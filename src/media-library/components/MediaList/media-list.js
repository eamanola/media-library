import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../reducers';
import logger from '../../../logger';
import { countUnPlayed } from './count-unplayeds';
import MediaList from './media-list.jsx';

const {
  createThumbnails,
  getMetas,
  getProbes,
} = actions;

const join = (current, subdir) => {
  if (current === '/') return `./${subdir}`;
  return `${current}/${subdir}`;
};

const AMediaList = ({ folder = null }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const thumbnails = useSelector(({ thumbnails: state }) => state);
  const probes = useSelector(({ probes: state }) => state);
  const played = useSelector(({ played: state }) => state);
  const metas = useSelector(({ metas: state }) => state);

  useEffect(() => {
    if (folder?.children.length) {
      const updateProbes = async () => {
        const videosWithoutProbe = folder.children
          .filter(({ video }) => !!video)
          .filter(({ video }) => !probes.some(({ probeId }) => probeId === video.videoId));

        if (videosWithoutProbe.length) {
          logger.log('MediaList:', folder.title, 'set probes', videosWithoutProbe.length);
          dispatch(getProbes(videosWithoutProbe.map(({ video }) => video)));
        }
      };
      updateProbes();
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
          .filter(({ video }) => !thumbnails
            .some(({ thumbnailId }) => thumbnailId === video.videoId));

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
    if (folder?.children.length) {
      const updateMetas = async () => {
        const foldersWithoutMeta = folder.children
          .filter(({ children }) => !!children)
          .filter(({ title }) => !metas.some(({ query }) => query === title));

        if (foldersWithoutMeta.length) {
          logger.log('MediaList:', folder.title, 'set metas', foldersWithoutMeta.length);
          dispatch(getMetas(foldersWithoutMeta));
        }
      };
      updateMetas();
    }
  }, [
    dispatch,
    folder,
    metas,
  ]);

  if (!folder?.children.length) return null;

  const list = folder.children.map(({ children, title, video }) => {
    const isSubFolder = Array.isArray(children);

    const isFrontPage = pathname === '/';
    // prepend media lib title
    const pathPrefix = isFrontPage ? `/${folder.title}` : pathname;

    // subfolder
    if (isSubFolder) {
      // const coverImage = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx145665-Qs53Mta5ngqs.jpg';
      let coverImage = null;
      const state = metas.find(({ query }) => query === title);
      if (state) {
        const { meta } = state;
        if (meta) {
          coverImage = meta.image;
        }
      }

      return {
        coverImage,
        folder: { children, title },
        isSubFolder,
        path: join(pathPrefix, title),
        unPlayed: countUnPlayed({ children }, played),
      };
    }

    // media item
    const { probe } = probes.find(({ probeId }) => probeId === video.videoId) || {};

    return {
      duration: probe?.duration || 0,
      hasProbe: !!probe,
      isPlayed: played.find(({ mediaId }) => video.displayId === mediaId)?.isPlayed === true,
      isSubFolder,
      thumbnail: thumbnails.find(({ thumbnailId }) => thumbnailId === video.videoId)?.thumbnail,
      title,
      video,
    };
  });

  return MediaList({ list, title: folder.title });
};

export default AMediaList;
