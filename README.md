# swpp2020-team7
  [![Build Status](https://travis-ci.org/swsnu/swpp2020-team7.svg?branch=master)](https://travis-ci.org/swsnu/swpp2020-team7) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2020-team7&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2020-team7) [![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2020-team7/badge.svg?branch=master)](https://coveralls.io/github/swsnu/swpp2020-team7?branch=master)

# Frontend  
### run  
```
cd frontend/naengpa
yarn install
yarn start
```

### test
```
cd frontend/naengpa
yarn install
yarn test --coverage --watchAll=false 
```

# Backend
### run
```
cd backend/naengpa 
pip install -r requirements.txt 
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 
```

### test 
```
cd backend/naengpa 
pip install -r requirements.txt 
python manage.py makemigrations 
python manage.py migrate
coverage run --source='.' manage.py test && coverage report
coverage run --branch --source='.' manage.py test && coverage report
```