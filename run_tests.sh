#!/bin/bash

# Test runner script for local development
# Usage: ./run_tests.sh [browser] [base_url]

set -e

# Default values
BROWSER=${1:-chromium}
BASE_URL=${2:-http://localhost:8000}

echo "Running tests with browser: $BROWSER, base_url: $BASE_URL"

# Create reports directory
mkdir -p reports

# Set environment variables
export BROWSER=$BROWSER
export BASE_URL=$BASE_URL
export HEADLESS=true

# Run tests
pytest tests/ \
    --html=reports/report-$BROWSER.html \
    --self-contained-html \
    --tb=short \
    --maxfail=5 \
    -v

echo "Tests completed. Check reports/report-$BROWSER.html for results."
