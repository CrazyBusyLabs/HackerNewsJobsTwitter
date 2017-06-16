'use strict';

var firebase = require('firebase');
var twitter = require('twitter');

var config = {
  databaseURL: "https://hacker-news.firebaseio.com"
};

console.log('Initializing Firebase');
firebase.initializeApp(config);

var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log('Listening to Firebase');
var newStoriesRef = firebase.database().ref("/v0/jobstories/0"); 
newStoriesRef.on("value", function(snapshot) {
  var storyRef = firebase.database().ref("/v0/item/"+snapshot.val());
  storyRef.on('value', function(storySnapshot) {
    if(storySnapshot.val() === null) {
        return
    }
    var story = storySnapshot.val();
    storyRef.off();

    console.log(`${story.id}: ${story.title} (${story.url}) [${story.deleted} ${story.dead}]`);
    if ((typeof story.deleted === 'undefined' || story.deleted === false)
        && (typeof story.dead === 'undefined' || story.dead === false)) {
      var message;
      if (story.url) {
        message = `${story.title} ${story.url}`;
      } else {
        message = `${story.title}`;
      }
      client.post('statuses/update', { status: message },  function(error, tweet, response) {
        if(error) throw error;
          console.log(`${story.id}: @@@ Tweeted`);
      });
    }
  });
});