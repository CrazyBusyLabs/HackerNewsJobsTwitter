/* eslint-disable global-require */
module.exports = {
  get ConfigService() { return require('./ConfigService'); },
  get LoggerService() { return require('./LoggerService'); },
  get TagService() { return require('./TagService'); },
  get TwitterService() { return require('./TwitterService'); },
};
