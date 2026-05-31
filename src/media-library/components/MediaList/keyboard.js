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
  const next = (listItem.previousSibling
    // End of line
    || listItem.parentNode.childNodes[listItem.parentNode.childNodes.length - 1]
  );

  return next;
};

const handleRight = (listItem) => {
  const next = listItem.nextSibling
    // End of line
    || listItem.parentNode.childNodes[0];

  return next;
};

const handleUp = (listItem) => {
  const container = listItem.parentNode;
  const containerWidth = listItem.parentNode.clientWidth;
  const elementIndex = [...container.childNodes].indexOf(listItem);

  if (isDisplayBlock(listItem)) {
    return listItem.previousSibling
      // End of line
      || listItem.parentNode.childNodes[0];
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
  return container.childNodes[0];
};

const handleDown = (listItem) => {
  const container = listItem.parentNode;
  const containerWidth = listItem.parentNode.clientWidth;
  const elementIndex = [...container.childNodes].indexOf(listItem);

  if (isDisplayBlock(listItem)) {
    return listItem.nextSibling
      // End of line
      || listItem.parentNode.childNodes[listItem.parentNode.childNodes.length - 1];
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
  return container.childNodes[container.childNodes.length - 1];
};

// End of line handling
// - null for no action
// - element for default eg. 1st or last
// - throw out of bound, and let client take focus elsewhere, eg another container

// conditions:
// media-list (or the container) contains only, and only media-items and sub-folders
// event target is inside the container, child or child of
// focus must be within container
const nextSelected = (e) => {
  const { key, target } = e;

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

export { nextSelected };

export default null;
