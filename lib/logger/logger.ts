export const Logger = {
  PREFIXES: {
    DB: '🛢️ [DB]',
    RD: '📊 [RD]',
    EMAIL: '📩 [EMAIL]',
    WORKER: '🧵 [WORKER]',
    API: '🌐 [API]',
    QUEUE: '📦 [QUEUE]',
    INIT: '🚀 [INIT]',
    ERROR: '❌ [ERROR]',
    SUCCESS: '✅ [SUCCESS]',
    INFO: 'ℹ️ [INFO]',
    WARNING: '⚠️ [WARNING]',
    DEBUG: '🐞 [DEBUG]',
  },

  getTimestamp() {
    return new Date().toISOString();
  },

  log(prefix: string, ...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.log(`[${Logger.getTimestamp()}]`, prefix, ...args);
  },

  info(prefix: string, ...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.info(`[${Logger.getTimestamp()}]`, prefix, ...args);
  },

  warn(prefix: string, ...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.warn(`[${Logger.getTimestamp()}]`, prefix, ...args);
  },

  error(prefix: string, ...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.error(`[${Logger.getTimestamp()}]`, prefix, ...args);
  },

  success(prefix: string, ...args: unknown[]) {
    // eslint-disable-next-line no-console
    console.log(`[${Logger.getTimestamp()}]`, prefix, ...args);
  },

  debug(prefix: string, ...args: unknown[]) {
    if (process.env.DEBUG === 'true') {
      // eslint-disable-next-line no-console
      console.debug(`[${Logger.getTimestamp()}]`, prefix, ...args);
    }
  },
};
