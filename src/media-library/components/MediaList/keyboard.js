const getWidth = (element) => {
  const style = getComputedStyle(element);
  const marginLeft = Number(style.getPropertyValue('margin-left').replace(/px$/u, ''));
  const marginRight = Number(style.getPropertyValue('margin-right').replace(/px$/u, ''));

  return element.offsetWidth + marginLeft + marginRight;
};

const isDisplayBlock = (element) => {
  const style = getComputedStyle(element);
  return style.getPropertyValue('display') === 'block';
};

const isFolder = (element) => element.classList.contains('sub-folder');

const isMediaItem = (element) => element.classList.contains('media-item');

const getListItem = (target) => {
  let listItem = target;

  while (!isMediaItem(listItem) && !isFolder(listItem)) {
    listItem = listItem.parentNode;

    if (listItem.classList.contains('media-list')) {
      return null;
    }
  }

  return listItem;
};

const handleLeft = (listItem) => {
  if (listItem.previousSibling) {
    return listItem.previousSibling;
  }

  // End of line
  // eslint-disable-next-line no-throw-literal
  throw {
    message: 'Out Of Bound',
    suggestion: listItem.parentNode.childNodes[listItem.parentNode.childNodes.length - 1],
  };
};

const handleRight = (listItem) => {
  if (listItem.nextSibling) {
    return listItem.nextSibling;
  }

  // End of line
  // eslint-disable-next-line no-throw-literal
  throw {
    message: 'Out Of Bound',
    suggestion: listItem.parentNode.childNodes[0],
  };
};

const handleUp = (listItem) => {
  const container = listItem.parentNode;
  const containerWidth = listItem.parentNode.clientWidth;
  const elementIndex = [...container.childNodes].indexOf(listItem);

  if (isDisplayBlock(listItem)) {
    if (listItem.previousSibling) {
      return listItem.previousSibling;
    }

    // End of line
    // eslint-disable-next-line no-throw-literal
    throw {
      message: 'Out Of Bound',
      suggestion: listItem.parentNode.childNodes[0],
    };
  }

  let traversed = 0;

  for (let i = elementIndex; i >= 0; i -= 1) {
    const current = container.childNodes[i];
    const width = getWidth(current);
    traversed += width;

    // traverse one container width worth
    if (traversed >= containerWidth) {
      return current;
    }
  }

  // End of line
  // eslint-disable-next-line no-throw-literal
  throw {
    message: 'Out Of Bound',
    suggestion: listItem.parentNode.childNodes[0],
  };
};

const handleDown = (listItem) => {
  const container = listItem.parentNode;
  const containerWidth = listItem.parentNode.clientWidth;
  const elementIndex = [...container.childNodes].indexOf(listItem);

  if (isDisplayBlock(listItem)) {
    if (listItem.nextSibling) {
      return listItem.nextSibling;
    }
    // End of line
    // eslint-disable-next-line no-throw-literal
    throw {
      message: 'Out Of Bound',
      suggestion: listItem.parentNode.childNodes[listItem.parentNode.childNodes.length - 1],
    };
  }

  let traversed = 0;

  for (let i = elementIndex; i < container.childNodes.length; i += 1) {
    const current = container.childNodes[i];
    const width = current.offsetWidth;
    traversed += width;

    // traverse one container width worth
    if (traversed >= containerWidth) {
      return current;
    }
  }

  // End of line
  // eslint-disable-next-line no-throw-literal
  throw {
    message: 'Out Of Bound',
    suggestion: listItem.parentNode.childNodes[listItem.parentNode.childNodes.length - 1],
  };
};

// End of line handling
// - null for no action
// - element for default eg. 1st or last
// - throw out of bound, and let client take focus elsewhere, eg another container

// conditions:
// media-list (or the container) contains only, and only media-items and sub-folders
// event target is inside the container, child or child of
// focus must be within container
const nextSelected = ({ key, target }) => {
  const listItem = getListItem(target);
  if (!listItem) return null;

  let next;

  switch (key) {
    case 'ArrowLeft':
      next = handleLeft(listItem);
      break;
    case 'ArrowRight':
      next = handleRight(listItem);
      break;
    case 'ArrowUp':
      next = handleUp(listItem);
      break;
    case 'ArrowDown':
      next = handleDown(listItem);
      break;
    default:
      next = null;
      break;
  }

  return next;
};

const jumpList = ({ key, target }) => {
  const mediaLists = [...document.querySelectorAll('.media-list')];
  const index = mediaLists.indexOf(target.parentNode);

  let nextList;
  let next;

  switch (key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      if (index > 0) {
        nextList = mediaLists[index - 1].childNodes;
        next = nextList[nextList.length - 1];
      }
      // End of line
      // go around?
      break;

    case 'ArrowRight':
    case 'ArrowDown':
      if (index < mediaLists.length - 1) {
        nextList = mediaLists[index + 1].childNodes;
        console.log(index, mediaLists, nextList);
        [next] = nextList;
      }
      // End of line
      // go around?
      break;

    default:
      next = null;
      break;
  }

  return next;
};

export { jumpList, nextSelected };

export default null;
