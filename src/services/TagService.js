// Libraries
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const html2plaintext = require('html2plaintext');

// Constants
const MIN_GENERIC_TAG = 3;
const MAX_GENERIC_TAG = 5;
const MAX_SPECIFIC_TAG = 5;

/**
 * TagService represents a singleton TagService.
 *
 * The service create technology tags from a URL:
 * - fetches the content of a URL
 * - keep the technology word
 * - create a set of tags for based on the word
 *
 * @class
 */
class TagService {
  /**
   * @constructor
   */
  constructor() {
    const techFilePath = path.join(__dirname, '../../data/tech.txt');
    this.techDictionary = fs
      .readFileSync(techFilePath, 'utf8')
      .split('\n')
      .map(tech => tech.toLowerCase());

    const tagFilePath = path.join(__dirname, '../../data/tag.txt');
    this.genericTags = fs
      .readFileSync(tagFilePath, 'utf8')
      .split('\n');
  }

  /**
   * Get the generic tags cloned and shuffled.
   */
  get shuffledGenericTags() {
    const shuffledArray = this.genericTags.slice(0);
    for (let i = shuffledArray.length; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * i);
      [shuffledArray[i - 1], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i - 1]];
    }
    return shuffledArray;
  }

  /**
   * @method
   * note: min and max included
   */
  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * @method
   * @return tags
   */
  async tag({ url }) {
    const tags = [];

    // add some generic tags
    tags.push(
      ...this.shuffledGenericTags.slice(
        0,
        TagService.random(MIN_GENERIC_TAG, MAX_GENERIC_TAG),
      ),
    );

    const response = await axios.get(url);

    if (response.status === 200) {
      const html = response.data;
      const text = html2plaintext(html);

      // keep only the technology words from the text
      const technologies = text
        .split(' ')
        .map(word => word.toLowerCase().replace(/[^a-z]+/g, ''))
        .filter(word => this.techDictionary.includes(word));

      // weights the technology words by # of occurences in the text
      const weightsTechnologies = technologies
        .reduce(
          (weights, word) => weights.set(word, weights.get(word) + 1 || 1),
          new Map([]), // default accumulator
        );

      // create the technology tags
      const technologyTags = Array.from(weightsTechnologies)
        // sort descendant
        .sort((a, b) => b[1] - a[1])
        // keep only the technology word (remove the weight)
        .map(a => a[0]);

      tags.push(
        ...technologyTags.slice(
          0,
          MAX_SPECIFIC_TAG,
        ),
      );
    }

    return tags;
  }
}

module.exports = new TagService();
