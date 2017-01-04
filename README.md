# WateringOfThings
Repository for the web application course.

# Server

## Requirements
*   Python 3
*   Sqlite
*   Running Redis server

## Installation
1.  Create a virtualenv to isolate our package dependencies locally

    ```bash
    cd server
    virtualenv env
    ```

2.  Start virtual environment

    ```bash
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
    python manage.py makemigrations api
    python manage.py migrate api
    ```

4.  Start server

    ```bash
    python manage.py runserver
    ```

5.  Start Celery beat and worker (for regular moisture measurements)

    ```bash
    celery -B  -A watering_of_things worker -l info
    ```
