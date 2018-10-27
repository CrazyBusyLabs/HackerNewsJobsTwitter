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
 * @name buildTags
 */
function buildTags({ url }, callback) {
  const NBR_GENERIC_TAGS = 6;
  let tags = [
    '#hiring',
    '#tweetmyjobs',
    '#jobopening',
    '#jobposting',
    '#jobhunt',
    '#joblisting',
  ];

  shuffle(tags);
  
  callback(tags.slice(0, NBR_GENERIC_TAGS));
}

module.exports = {
  buildTags
}