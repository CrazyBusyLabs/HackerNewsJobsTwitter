// Libraries
require('dotenv').config();

// Projects
const { FirebaseEmitter } = require('./events');
const {
  ConfigService: Config,
  LoggerService: Logger,
  TwitterService: Twitter,
} = require('./services');

Logger.info('Starting the application');

const twitter = new Twitter(Config.Twitter);

new FirebaseEmitter()
  .on('newStory', twitter.tweet)
  .start();

Logger.info('The application is listening');
