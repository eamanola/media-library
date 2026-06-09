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

const getListItem = ({ currentTarget, target }) => {
  let listItem = currentTarget || target;

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
  throw { message: 'Out Of Bound', suggestion: listItem.parentNode.lastChild };
};

const handleRight = (listItem) => {
  if (listItem.nextSibling) {
    return listItem.nextSibling;
  }

  // End of line
  // eslint-disable-next-line no-throw-literal
  throw { message: 'Out Of Bound', suggestion: listItem.parentNode.firstChild };
};

const handleUp = (listItem) => {
  const container = listItem.parentNode;
  const children = [...container.childNodes];
  const containerWidth = container.clientWidth;
  const elementIndex = children.indexOf(listItem);

  if (isDisplayBlock(listItem)) {
    if (listItem.previousSibling) {
      return listItem.previousSibling;
    }

    // End of line
    // eslint-disable-next-line no-throw-literal
    throw { message: 'Out Of Bound', suggestion: container.firstChild };
  }

  let traversed = 0;
  // let lastLeft = children[elementIndex].offsetLeft;

  for (let i = elementIndex; i >= 0; i -= 1) {
    const current = children[i];

    // // line changed
    // if (lastLeft < current.offsetLeft) {
    //   const trailingWhiteSpace = containerWidth - current.offsetLeft - getWidth(current);
    //   traversed += trailingWhiteSpace;
    // }
    // lastLeft = current.offsetLeft;

    const width = getWidth(current);
    traversed += width;

    // traverse one container width worth
    if (traversed >= containerWidth) {
      return current;
    }
  }

  // End of line
  // eslint-disable-next-line no-throw-literal
  throw { message: 'Out Of Bound', suggestion: container.firstChild };
};

const handleDown = (listItem) => {
  const container = listItem.parentNode;
  const children = [...container.childNodes];
  const containerWidth = container.clientWidth;
  const elementIndex = children.indexOf(listItem);

  if (isDisplayBlock(listItem)) {
    if (listItem.nextSibling) {
      return listItem.nextSibling;
    }
    // End of line
    // eslint-disable-next-line no-throw-literal
    throw { message: 'Out Of Bound', suggestion: container.lastChild };
  }

  let traversed = 0;
  // let lastLeft = children[elementIndex].offsetLeft;

  for (let i = elementIndex; i < children.length; i += 1) {
    const current = children[i];

    // // line changed
    // if (lastLeft > current.offsetLeft) {
    //   // take trailing white space
    //   const previous = current.previousSibling;
    //   const trailingWhiteSpace = containerWidth - previous.offsetLeft - getWidth(previous);
    //   traversed += trailingWhiteSpace;
    // }
    // lastLeft = current.offsetLeft;

    const width = getWidth(current);
    traversed += width;

    // traverse one container width worth
    if (traversed >= containerWidth) {
      return current;
    }
  }

  // End of line
  // eslint-disable-next-line no-throw-literal
  throw { message: 'Out Of Bound', suggestion: container.lastChild };
};

// End of line handling
// - null for no action
// - element for default eg. 1st or last
// - throw out of bound, and let client take focus elsewhere, eg another container

// conditions:
// media-list (or the container) contains only, and only media-items and sub-folders
// event target is inside the container, child or child of
// focus must be within container
const nextSelected = ({ key, currentTarget, target }) => {
  // note: currentTarget is always listItem
  const listItem = getListItem({ currentTarget, target });
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

const jumpList = ({ key, currentTarget, target }) => {
  const mediaLists = [...document.querySelectorAll('.media-list')];

  // nowhere to jump
  if (mediaLists.length < 2) return null;

  const listItem = getListItem({ currentTarget, target });
  const index = mediaLists.indexOf(listItem.parentNode);

  let nextList;
  let next;
  let suggestion;

  switch (key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      if (index > 0) {
        nextList = mediaLists[index - 1].childNodes;
        next = nextList[nextList.length - 1];
      }

      // End of line
      if (!next) {
        nextList = mediaLists[mediaLists.length - 1].childNodes;
        suggestion = nextList[nextList.length - 1];

        // eslint-disable-next-line no-throw-literal
        throw { message: 'Out Of Bound', suggestion };
      }

      break;

    case 'ArrowRight':
    case 'ArrowDown':
      if (index < mediaLists.length - 1) {
        nextList = mediaLists[index + 1].childNodes;
        [next] = nextList;
      }

      // End of line
      if (!next) {
        nextList = mediaLists[0].childNodes;
        [suggestion] = nextList;

        // eslint-disable-next-line no-throw-literal
        throw { message: 'Out Of Bound', suggestion };
      }
      break;

    default:
      next = null;
      break;
  }

  return next;
};

export { jumpList, nextSelected };

export default null;
