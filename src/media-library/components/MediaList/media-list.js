import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../reducers';
import logger from '../../../logger';
import { countUnPlayed } from './count-unplayeds';
import MediaList from './media-list.jsx';

const {
  createThumbnails,
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

  useEffect(() => {
    if (folder?.children.length) {
      const updateMeta = async () => {
        const videosWithoutProbe = folder.children
          .filter(({ video }) => !!video)
          .filter(({ video }) => !probes.some(({ probeId }) => probeId === video.realId));

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
          .filter(({ video }) => !thumbnails
            .some(({ thumbnailId }) => thumbnailId === video.realId));

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

  if (!folder?.children.length) return null;

  const list = folder.children.map(({ children, title, video }) => {
    const isSubFolder = Array.isArray(children);

    // subfolder
    if (isSubFolder) {
      return {
        isSubFolder,
        path: join(pathname, title),
        title,
        unPlayed: countUnPlayed({ children }, played),
      };
    }

    // media item
    const { probe } = probes.find(({ probeId }) => probeId === video.realId) || {};

    return {
      duration: probe?.duration || 0,
      hasProbe: !!probe,
      isPlayed: played.find(({ mediaId }) => video.displayId === mediaId)?.isPlayed === true,
      isSubFolder,
      thumbnail: thumbnails.find(({ thumbnailId }) => thumbnailId === video.realId)?.thumbnail,
      title,
      video,
    };
  });

  return MediaList({ list, title: folder.title });
};

export default AMediaList;
