// Libraries
const axios = require('axios');
const fs = require('fs')
const html2plaintext = require('html2plaintext');

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

          // keep only the technologies from the text
          const technologies = text
            .split(' ')
            .map(word => word.toLowerCase().replace(/[^a-z]+/g, ''))
            .filter(word => techDictionarry.includes(word));

          // wrights the technologies
          const weightsTechnologies = technologies
            .reduce(
              (weights, word) => weights.set(word, weights.get(word) + 1 || 1), 
              new Map([])
            );

            // create the technology hashtags
          const technologyHashtags = Array.from(weightsTechnologies)
            // sort descendant
            .sort((a, b) => b[1] - a[1])
            // keep only the technology word (remove the weight)
            .map(a => a[0]);
          
          shuffle(genericTags);

          const hashtags = [
            ...genericTags.slice(0, randomIntFromInterval(MIN_GENERIC_TAG, MAX_GENERIC_TAG)),
            ...technologyHashtags.slice(0, MAX_SPECIFIC_TAG),
          ];

          callback(hashtags);
        }
      }
    );
}

module.exports = {
  initialize,
  buildTags
}