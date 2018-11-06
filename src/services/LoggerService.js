// Libraries
const {
  createLogger,
  format: {
    combine,
    json,
    metadata,
    timestamp,
  },
  transports: { Console },
} = require('winston');

/**
 * LoggerService represents a singleton LoggerService.
 *
 * The logger levels are the following custom levels:
 *  error: 0,
 *  info: 1,
 *  verbose: 2.
 *
 * The service is based on the
 * {@link https://www.npmjs.com/package/winston|winston} package.
 * @class
 */
class LoggerService {
  /**
   * @constructor
   */
  constructor() {
    const levels = {
      error: 0,
      info: 1,
      verbose: 2,
    };

    this.logger = createLogger({
      level: 'verbose',
      levels,
      transports: [
        new Console({
          timestamp: true,
          format: combine(
            json(),
            metadata(),
            timestamp(),
          ),
        }),
      ],
    });
  }

  /**
   * Logs the message at the error level.
   * @method
   * @argument message
   * @argument meta
   */
  error(message, meta = {}) {
    this.logger.log('error', message, meta);
  }

  /**
   * Logs the message at the info level.
   * @method
   * @argument message
   * @argument meta
   */
  info(message, meta = {}) {
    this.logger.log('info', message, meta);
  }

  /**
   * Logs the message at the verbose level.
   * @method
   * @argument message
   * @argument meta
   */
  verbose(message, meta = {}) {
    this.logger.log('verbose', message, meta);
  }
}

module.exports = new LoggerService();
