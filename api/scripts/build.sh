#!/usr/bin/env bash

if [ ! -d "dist" ]; then
  mkdir dist
fi
echo PACKAGE_VERSION=$npm_package_version > dist/.env
tsc
