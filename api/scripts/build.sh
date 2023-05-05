#!/usr/bin/env bash

mkdir dist
echo PACKAGE_VERSION=$npm_package_version > dist/.env
tsc
