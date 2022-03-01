## How to get started

### Set up

Dependecies:

- [Python](https://www.python.org/)

A virtual enviroment is a directory tree, which contains a Python installation for a specific Python version and additional packages included. 

[You can read more about virtual environments here](https://docs.python.org/3/tutorial/venv.html)

Install virtualenv:  
`$ pip install pipenv`


Create and activate a virtual environment:  
`$ pipenv shell`


Install requirements for development:  
`$ pip install -r requirements.txt`


Initialize database:
`$ python manage.py migrate schoolbudget`


Create an admin user:  
`$ python manage.py createsuperuser`

### Workflow

Activate enviroment:
`$ pipenv shell`

Run the server:
`$ python manage.py runserver`


If the models are changed, the database must be updated:
`$ python manage.py makemigrations schoolbudget`
`$ python manage.py migrate schoolbudget`

https://docs.djangoproject.com/en/3.1/topics/migrations/

To run test:
`$ python manage.py test`

