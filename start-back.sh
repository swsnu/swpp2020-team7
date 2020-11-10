#!/bin/bash
# usage: ./start-back.sh {path-to-virtual-environment-folder}
source $1/bin/activate
cd backend/naengpa
pip install -r requirements.txt 
python manage.py makemigrations
python manage.py migrate
python manage.py runserver