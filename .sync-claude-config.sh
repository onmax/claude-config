#!/bin/bash
cd /home/maxi/.claude
git fetch --quiet origin master
git reset --hard origin/master
