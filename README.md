# WateringOfThings
Repository for the web application course.

# Server

## Requirments
*   Python 3
*   Sqlite

## Installation
1.  Create a virtualenv to isolate our package dependencies locally
    ```bash
    cd server
    virtualenv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
    ```
2.  Install dependencies
    ```bash
    pip install -r requirements.txt
    ```
3.  Init database
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
4.  Start server
    ```bash
    python manage.py runserver
    ```
5.  Start Celery beat and worker (for regular moisture measurements)
    ```bash
    celery -B  -A api worker -l info
    ```
