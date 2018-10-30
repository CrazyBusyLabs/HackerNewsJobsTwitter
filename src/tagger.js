// Libraries
const axios = require('axios');
const fs = require('fs')
const html2plaintext = require('html2plaintext');
const stopword = require('stopword')

let techDictionarry;
let genericTags;

/**
 * @function
 * @name buildTags
 */
function initialize() {
  techDictionarry = fs
    .readFileSync(__dirname + '/../data/tech.txt', 'utf8')
    .split('\n')
    .map(tech => tech.toLowerCase());

  genericTags = fs
    .readFileSync(__dirname + '/../data/tag.txt', 'utf8')
    .split('\n');
}

/**
 * @function
 * @name shuffle
 */
function shuffle(arr) {
  for (let i = arr.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
}

/**
 * @function
 * @name randomIntFromInterval
 * min and max included
 */
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @function
 * @name buildTags
 */
function buildTags({ url }, callback) {
  const MIN_GENERIC_TAG = 3;
  const MAX_GENERIC_TAG = 5;
  const MAX_SPECIFIC_TAG = 5;

  axios.get(url)
    .then((response) => {
        if(response.status === 200) {
          const html = response.data;
          const text = html2plaintext(html);
          const cleanupText = text.toLowerCase();

          const textArray = cleanupText.split(' ');

          const words = stopword
            .removeStopwords(textArray)
            .filter(word => /^[a-zA-Z]+$/.test(word))

          const technologies = words
            .filter(word => techDictionarry.includes(word))       

          const weightsWords = {};
          technologies.map(word => {
            weightsWords[word] = weightsWords[word] + 1 || 1;
          });
          const weightsWordsArray = [];
          for (let word in weightsWords) {
            const weight = weightsWords[word];
            weightsWordsArray.push([word, weight]);
          }
          const hashtags = weightsWordsArray
            // sort descendant
            .sort((a, b) => b[1] - a[1])
            // keep only the word
            .map(a => a[0])
            // linit the number of tags
            .slice(0, MAX_SPECIFIC_TAG)
          
          // add some generic tags if necessary
          const numberOfTags = randomIntFromInterval(MIN_GENERIC_TAG, MAX_GENERIC_TAG);
          shuffle(genericTags);
          hashtags.unshift(...genericTags.slice(0, numberOfTags));

          callback(hashtags);
        }
      }
    );
}

module.exports = {
  initialize,
  buildTags
}