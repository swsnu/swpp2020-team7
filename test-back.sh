#!/bin/bash
# usage: ./test-back.sh {path-to-virtual-environment-folder}
if [ -z "$1" ] 
then
    echo "No virtual environment provided"
else
    echo "try activating virtual environment [@$1/bin/activate]"
    source $1/bin/activate
fi

cd backend/naengpa 
pip install -r requirements.txt 
python manage.py makemigrations 
python manage.py migrate
coverage run --source='.' --omit=*/migrations/*,*/management/commands/*,manage.py,naengpa/*,utils/* manage.py test && coverage report -m
coverage run --branch --source='.' --omit=*/migrations/*,*/management/commands/*,manage.py,naengpa/*,utils/* manage.py test && coverage report -m