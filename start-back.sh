#!/bin/bash
# usage: ./start-back.sh {path-to-virtual-environment-folder}
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

redis-server --daemonize yes
python manage.py runserver