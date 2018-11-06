// Libraries
const Twitter = require('twitter');

// Projects
const Logger = require('./LoggerService');
const Tagger = require('./TagService');
/**
 * TwitterService represents a singleton TwitterService.
 * @class
 */
class TwitterService {
  /**
   * @constructor
   */
  constructor() {
    Logger.info('Initializing Twitter');
    this.twitter = new Twitter();
  }

  /**
   * @method
   * @name tweet
   */
  async tweet({ id, title, url }) {
    const tags = await Tagger.tag({ url });
    const hashtags = tags
      .map(a => `#${a}`)
      .join(' ');

    const message = `${title} ${url} ${hashtags}`;

    // Tweet only for production
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
      await this.twitter.post('statuses/update', { status: message });
      Logger.info(`${id}: ${message} @@@ Tweeted`);
    } else {
      // for development just console log
      Logger.verbose(`DEV ${id}: ${message} @@@ would have been tweeted`);
    }
  }
}

module.exports = TwitterService;
