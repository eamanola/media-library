const ENABLE_LOGGING = true;

const log = ENABLE_LOGGING ? console.log.bind(console) : () => null;

// export { log };

export default { log };
