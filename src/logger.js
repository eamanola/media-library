const ENABLE_LOGGING = import.meta.env.VITE_ENABLE_LOGGING;

// vite modes:
// - import.meta.env.PROD = true
// when serving built files, using eg. vite serve
// - import.meta.env.DEV = true
// live code/dev server, vite
// - import.meta.env.MODE: can be overwritten with vite ... --mode flag
// defaults to above

const log = ENABLE_LOGGING ? console.log.bind(console) : () => null;

// export { log };

export default { log };
