#!/bin/bash
# usage: ./lint-check.sh {path-to-virtual-environment-folder}
if [ -z "$1" ] 
then
    echo "No virtual environment provided"
else
    echo "try activating virtual environment [@$1/bin/activate]"
    source $1/bin/activate
fi

cd frontend/naengpa
yarn lint --fix

cd ../../backend/naengpa
pylint **/*.py