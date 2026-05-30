import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import MediaList from '../MediaList';
import logger from '../../../logger';

const FileBrowser = () => {
  const { pathname } = useLocation();

  const mediaLibrary = useSelector(({ mediaLibrary: state }) => state);

  const [folder, setFolder] = useState(null);

  useEffect(() => {
    if (mediaLibrary?.length) {
      const selectFolder = async () => {
        const path = pathname
          .split('/')
          .filter((part) => part !== '')
          .map((part) => decodeURIComponent(part));

        const firstLib = mediaLibrary[0];
        const target = path.reduce((currentFolder, subFolder) => currentFolder.children.find(
          ({ title }) => title === subFolder,
        ), firstLib);

        setFolder(target);
        return target;
      };

      selectFolder();
    }
  }, [mediaLibrary, pathname]);

  useEffect(() => { logger.log('FileBrowser: set folder', folder); }, [folder]);

  if (folder === null) return null;

  return (
    <MediaList folder={folder} />
  );
};

export default FileBrowser;
