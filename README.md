# HackerNews Jobs Twitter Integration

[![CircleCI](https://circleci.com/gh/jcurlier/hackernews-jobs-twitter.svg?style=svg)](https://circleci.com/gh/jcurlier/hackernews-jobs-twitter) [![Twitter](https://img.shields.io/twitter/follow/hackernewsjobs.svg?style=social&label=Follow)](https://twitter.com/hackernewsjobs)

A simple Firebase listener in node.js to get the new job posts from HackerNews and then to publish them on the *non-official*  [@hackernewsjobs](https://twitter.com/hackernewsjobs) channel on Twitter.

This project was started as a learning experience and I welcome anyone else in the web development community to play with it :smiley:

## Installation

Set the environemnt variables in the `.env` for `development` and using your deployment capabilities for `production`:

| Environment Variable |
| --- |
| TWITTER_CONSUMER_KEY |
| TWITTER_CONSUMER_SECRET |
| TWITTER_ACCESS_TOKEN_KEY |
| TWITTER_ACCESS_TOKEN_SECRET |

Run `npm run dev` for a `development` server.

Run `npm run start` for a `production` server.

## Deployment

In both cases, you should increment the package version using `npm version patch`

### Local

Set the `eb` command and `npm run deploy`

### CircleCI

CircleCI will automatically deploy the latest `master` branch

---

## Credits

Credit where credit is due:
* [HackerNews API](https://github.com/HackerNews/API)
* [HackerNews Jobs](https://news.ycombinator.com/jobs)
