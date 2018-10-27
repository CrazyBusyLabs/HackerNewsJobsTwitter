#!/bin/bash
set -e

function build {
  filename=hackernews-jobs-twitter-v$version.zip
  zip -r ./build/$filename ./package.json ./.npmrc ./src
}

function help {
	echo "Usage: $(basename $0) <newversion>"
}

if [ -z "$1" ] || [ "$1" = "help" ]; then
	help
	exit
fi

# Set global version
version=$1

echo "Building version $version"
build $version


