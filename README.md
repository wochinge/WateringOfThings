# WateringOfThings
Repository for the web application course.

# React Native Application

## Requirements
*   Installed React Native: <https://facebook.github.io/react-native/docs/getting-started.html>

## Installation
1.  Install dependencies:

    ```bash
    cd ReactNativeApp
    npm install
    react-native link
    ```

2.  Configure the host of your REST API under ``app\network\host.{platform}.js

## Troubleshooting
*   App quits after start or when selecting a plant image:
    -   Check whether manual configuration of the image-cropper is correct: <https://github.com/ivpusic/react-native-image-crop-picker#post-install-steps>

*   App quits when selection a plant image:
    -   Check whether the permissions to the Photo Library are configured in your XCode-Project


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
    python manage.py makemigrations api
    python manage.py migrate api
    ```

4.  Adjust the config files for your setup
    *   MQTT-Broker: watering_of_things/config/mqtt_settings.py
    *   Redis-Server watering_of_things/celery.py
    Here you can find a list of public mqtt brokers: <https://github.com/mqtt/mqtt.github.io/wiki/public_brokers>

5.  Start server

    ```bash
    python manage.py runserver
    ```

6.  Start Celery beat and worker (for regular moisture measurements)

    ```bash
    celery -B  -A watering_of_things worker -l info
    ```
