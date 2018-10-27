// Libraries
const dotenv = require('dotenv');
const firebase = require('firebase');
const Twitter = require('twitter');

// Project modules
const tagger = require('./tagger');

// Constants
const FIREBASE_HACKER_NEWS_URL = 'https://hacker-news.firebaseio.com';

// twitter client
let twitter;

/**
 * @function
 * @name myFunction
 */
function initialize() {
  console.log('Initializing Configuration');
  dotenv.config()
  const config = {
    databaseURL: FIREBASE_HACKER_NEWS_URL,
    twitter: {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
  };

  console.log('Initializing Firebase');
  firebase.initializeApp(config);

  twitter = new Twitter(config.twitter);
}

/**
 * @function
 * @name tweet
 */
function tweet({id, title, url}) {
  tagger.buildTags({ url }, (tags) => {
    const message = `${title} ${url} ${tags.join(' ')}`;

    // Tweet only for production
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
      twitter.post('statuses/update', { status: message },  (error, tweet, response) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`${id}: ${message} @@@ Tweeted`);
        }
      });

    // for development just console log
    } else {
      console.log(`DEV ${id}: ${message} @@@ would have been tweeted`);
    }
  });
}

/**
 * @function
 * @name listen
 */
function listen() {
  console.log('Listening to Firebase');
  const newStoriesRef = firebase.database().ref("/v0/jobstories/0");

  // process new events
  newStoriesRef.on('value', (snapshot) => {

    // get the event data
    const storyRef = firebase.database().ref(`/v0/item/${snapshot.val()}`);
    storyRef.on('value', (storySnapshot) => {

      if(storySnapshot.val() === null) {
          return
      }
      const story = storySnapshot.val();
      storyRef.off();

      const {id, title, url, deleted, dead} = story;

      // only keeps the stories that are not deleted, dead
      // and that have an url
      if ((typeof deleted === 'undefined' || deleted === false)
          && (typeof dead === 'undefined' || dead === false)
          && url) {

        tweet({id, title, url});
      }
    });
  });
}

console.log('Initializing the application');
initialize();

console.log('Start listenting');
listen();
console.log('Listening');