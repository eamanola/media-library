const findFolder = (folder, value, { property = 'videoId' }) => {
  const videos = folder.children.filter(({ video }) => !!video);
  const found = videos.find(({ video }) => video[property] === value);
  if (found) {
    return { folder, video: found };
  }

  const subFolders = folder.children.filter(({ children }) => Array.isArray(children));
  for (let i = 0; i < subFolders.length; i += 1) {
    const respone = findFolder(subFolders[i], value, { property });
    if (respone !== null) return respone;
  }

  return null;
};

const findFolderBy = (value, { folder = null, property = 'videoId', state = [] }) => {
  if (folder) {
    const respone = findFolder(folder, value, { property });
    return respone;
  }

  for (let i = 0; i < state.length; i += 1) {
    const respone = findFolder(state[i], value, { property });
    if (respone) return respone;
  }

  return null;
};

const folderByVideoId = (videoId, { folder, state }) => (
  findFolderBy(videoId, { folder, property: 'videoId', state })?.folder
);

const folderByDisplayId = (displayId, { folder, state }) => (
  findFolderBy(displayId, { folder, property: 'displayId', state })?.folder
);

export {
  folderByVideoId,
  folderByDisplayId,
};

export default null;
