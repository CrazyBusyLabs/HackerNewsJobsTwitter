// Libraries
var firebase = require('firebase');
var Twitter = require('twitter');

// Configuration
var config = {
  databaseURL: "https://hacker-news.firebaseio.com",
  twitter: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
};

// twitter client
let twitter;

/**
 * @function
 * @name myFunction
 */
function initialize() {
  console.log('Initializing Firebase');
  firebase.initializeApp(config);

  twitter = new Twitter(config.twitter);
}

/**
 * @function
 * @name listen
 */
function listen() {
  console.log('Listening to Firebase');
  const newStoriesRef = firebase.database().ref("/v0/jobstories/0");

  // process new events
  newStoriesRef.on("value", (snapshot) => {

    // get the event data
    var storyRef = firebase.database().ref(`/v0/item/${snapshot.val()}`);
    storyRef.on('value', (storySnapshot) => {

      if(storySnapshot.val() === null) {
          return
      }
      var story = storySnapshot.val();
      storyRef.off();

      const {id, title, url, deleted, dead} = story;
      if ((typeof deleted === 'undefined' || deleted === false)
          && (typeof dead === 'undefined' || dead === false)
          && url) {

        console.log(`${id}: ${title} (${url}) [${deleted} ${dead}]`);
        const message = `${title} ${url}`;
        twitter.post('statuses/update', { status: message },  (error, tweet, response) => {
          if (error) {
            console.error(error);
          } else {
            console.log(`${id}: @@@ Tweeted`);
          }
        });
      }
    });
  });
}

console.log('Initializing the application');
initialize();

console.log('Start listenting');
listen();
console.log('Listening');