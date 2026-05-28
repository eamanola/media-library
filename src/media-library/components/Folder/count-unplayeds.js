const isPlayed = (video) => video.played?.isPlayed === true;

const countUnplayed = (subFolder) => {
  let unplayed = 0;

  const { video, children } = subFolder;

  if (video) {
    if (!isPlayed(video)) unplayed += 1;
  } else if (children) {
    for (let i = 0; i < children.length; i += 1) {
      unplayed += countUnplayed(children[i]);
    }
  } else {
    console.error(subFolder);
  }

  return unplayed;
};

const unPlayedCount = (folder) => {
  const counted = folder.children.map((child) => {
    const unplayed = countUnplayed(child);

    return { ...child, unplayed };
  });

  return counted;
};

export default unPlayedCount;
