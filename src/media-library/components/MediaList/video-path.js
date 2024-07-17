const pathByKey = (folder, key, value, paths = []) => {
  let videoPath = null;

  Object.keys(folder).every((aKey) => {
    if (folder[aKey][key]) {
      if (value === folder[aKey][key]) {
        videoPath = [...paths, aKey];
        return false;
      }
    } else {
      const found = pathByKey(folder[aKey], key, value, [...paths, aKey]);
      if (found) {
        videoPath = found;
        return false;
      }
    }

    return true;
  });

  return videoPath;
};

const pathById = (folder, id) => pathByKey(folder, 'id', id);

export { pathById };
export default null;

// const aaa = '[Judas] Noragami (Seasons 1-2 + OADs) [BD 1080p]
// /NCED 03.mkv';
// if (tree) {
//   console.log(findVideo(tree, aaa));
// }
