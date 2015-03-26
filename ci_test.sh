#!/usr/bin/env bash

npm install
export PATH="$(npm bin):$PATH"

grunt test
