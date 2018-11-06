// Libraries
const EventEmitter = require('events');
const firebase = require('firebase');

// Project
const { ConfigService, LoggerService: Logger } = require('../services');

/**
 * FirebaseEmitter.
 * @class
 */
class FirebaseEmitter extends EventEmitter {
  /**
   * @constructor
   */
  constructor() {
    super();
    const config = {
      databaseURL: ConfigService.FirebaseDatabaseURL,
    };

    Logger.info('Initializing Firebase');
    firebase.initializeApp(config);
  }

  /**
   * @function
   * @name start
   */
  start() {
    Logger.info('Listening to Firebase stories');
    const newStoriesRef = firebase.database().ref('/v0/jobstories/0');

    // process new events
    newStoriesRef.on('value', (snapshot) => {
      // get the event data
      const storyRef = firebase.database().ref(`/v0/item/${snapshot.val()}`);
      storyRef.on('value', async (storySnapshot) => {
        if (storySnapshot.val() === null) {
          return;
        }
        const story = storySnapshot.val();
        storyRef.off();

        const {
          id,
          title,
          url,
          deleted,
          dead,
        } = story;

        // only keeps the stories that are not deleted, dead
        // and that have an url
        if ((typeof deleted === 'undefined' || deleted === false)
            && (typeof dead === 'undefined' || dead === false)
            && url) {
          this.emit('newStory', { id, title, url });
        }
      });
    });
  }
}

module.exports = FirebaseEmitter;
