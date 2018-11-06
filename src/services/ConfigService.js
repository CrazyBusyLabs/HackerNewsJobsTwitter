// Constants
const FIREBASE_HACKER_NEWS_URL = 'https://hacker-news.firebaseio.com';
const {
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_CONSUMER_KEY,
} = process.env;

/**
 * ConfigService.
 * @class
 */
class ConfigService {
  /**
   * The Firebase database URL.
   */
  static get FirebaseDatabaseURL() {
    return FIREBASE_HACKER_NEWS_URL;
  }

  /**
   * The Twitter configuration.
   */
  static get Twitter() {
    return {
      access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
      access_token_key: TWITTER_ACCESS_TOKEN_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      consumer_key: TWITTER_CONSUMER_KEY,
    };
  }
}

module.exports = ConfigService;
