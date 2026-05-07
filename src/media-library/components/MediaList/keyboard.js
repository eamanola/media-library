const getWidth = (element) => {
  const style = getComputedStyle(element);
  const marginLeft = Number(style.getPropertyValue('margin-left').replace(/px$/u, ''));
  const marginRight = Number(style.getPropertyValue('margin-right').replace(/px$/u, ''));

  return element.offsetWidth + marginLeft + marginRight;
};

const jump = (element) => Math.floor(element.parentNode.clientWidth / getWidth(element));

const isFolder = (element) => element.classList.contains('media-folder');

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

const handleLeft = (listItem) => (
  listItem.previousSibling
    || listItem.parentNode.childNodes[listItem.parentNode.childNodes.length - 1]
);

const handleRight = (listItem) => (
  listItem.nextSibling || listItem.parentNode.childNodes[0]
);

// TODO: up, from folder to media-item row,
// it should go first in row, not last
// jump should be based on inbetweens not current

// TODO: up & down, media-item row. to go to target, not 1st or last
// inbeweens could include items from other end of list, if not full

// NOTE: wait for real life applications

// const testing = (listItem) => {
//   let current = listItem;
//   let width = 0;
//   const maxWidth = listItem.parentNode.clientWidth;

//   while (current.previousSibling) {
//     const previous = current.previousSibling;

//     const previousWidth = getWidth(previous);
//     if (width + previousWidth > maxWidth) {
//       return current;
//     }
//     console.log(previous, previousWidth, width, maxWidth);

//     current = previous;
//     width += previousWidth;
//   }

//   console.log(111);
//   return current;
// };

const handleUp = (listItem) => {
  const siblings = [...listItem.parentNode.childNodes];
  const index = siblings.indexOf(listItem);
  const maxSteps = jump(listItem);
  const steps = siblings.slice(Math.max(index - maxSteps, 0), index).reverse();

  const folder = steps.find((item) => isFolder(item));
  if (folder) {
    return folder;
  }

  return steps[steps.length - 1] || siblings[siblings.length - 1];
};

const handleDown = (listItem) => {
  const siblings = [...listItem.parentNode.childNodes];
  const index = siblings.indexOf(listItem);
  const maxSteps = jump(listItem);
  const steps = siblings.slice(index + 1, Math.min(index + maxSteps + 1, siblings.length));

  const folder = steps.find((item) => isFolder(item));
  if (folder) {
    return folder;
  }

  return steps[steps.length - 1] || siblings[0];
};

// media-list contains only media-items and media-folders
// event target is a child of media-list
// media-folder display is block
// media-item display is inline-block
// media-items are equal in width
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
