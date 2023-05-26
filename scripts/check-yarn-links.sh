#!/bin/bash

LINKED_MODULES=$(yarn list --pattern "link:")

if [[ $LINKED_MODULES == *"link:"* ]]; then
  echo "Error: Found yarn link dependencies. Please remove them before releasing."
  exit 1
else
  echo "No yarn link dependencies found. Proceeding with releasing."
fi
