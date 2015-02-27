# mobile-app

Hackafe Mobile App

# Install

To build, install cordova, ionic and bower

    $ npm install -g cordova ionic bower

Then run

    $ bower install
    $ ionic platform add android
    $ ionic plugin add https://github.com/phonegap-build/PushPlugin
    $ ionic build android
    $ ionic emulate android
