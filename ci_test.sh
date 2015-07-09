#!/usr/bin/env bash

case $CIRCLE_NODE_INDEX in
0)
    export RUN_SAUCE_TESTS=true
    grunt test
    ;;
1)
    grunt test
    ;;
esac
