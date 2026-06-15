const KEY_PREFIX = 'META_KEY_';

const get = async (query) => {
  const str = localStorage.getItem(`${KEY_PREFIX}${query}`);
  return JSON.parse(str);
};

const set = async (query, meta) => {
  const str = JSON.stringify(meta || null);
  localStorage.setItem(`${KEY_PREFIX}${query}`, str);
};

// export {
//   get,
//   set,
// };

export default { get, set };
