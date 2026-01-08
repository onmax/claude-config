#!/bin/bash
cd /home/maxi/.claude

# Wait for any existing git operations to complete
timeout=10
while [ -f .git/index.lock ] && [ $timeout -gt 0 ]; do
  sleep 0.5
  timeout=$((timeout-1))
done

# Remove stale lock if still exists
rm -f .git/index.lock

git fetch --quiet origin master 2>/dev/null || true
git reset --hard origin/master 2>/dev/null || true
