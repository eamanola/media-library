const isPlayed = ({ id }, played) => played.find(({ mediaId }) => mediaId === id)?.isPlayed;

const countUnPlayed = (subFolder, played) => {
  let unPlayed = 0;

  const { video, children } = subFolder;

  if (video) {
    if (!isPlayed(video, played)) unPlayed += 1;
  } else if (children) {
    for (let i = 0; i < children.length; i += 1) {
      unPlayed += countUnPlayed(children[i], played);
    }
  } else {
    console.error(subFolder);
  }

  return unPlayed;
};

export {
  countUnPlayed,
};

export default null;
