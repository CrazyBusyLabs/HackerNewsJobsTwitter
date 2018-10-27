#!/bin/bash
set -e

function help {
	echo "Usage: $(basename $0) <newversion>"
}

if [ -z "$1" ] || [ "$1" = "help" ]; then
	help
	exit
fi

# Set global version
version=$1
label=hackernews-jobs-twitter-v$version

echo "Deploying to Elastic Beanstalk with label $label"
eb deploy --label $label
echo "Deployed to Elastic Beanstalk"
