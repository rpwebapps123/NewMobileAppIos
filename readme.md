## PROVIGIL


## Prerequisites
    * Node
    * NPM
    * Ionic
    * TypeScript

## Install Packages
    * Run command `npm install` on the project directory to install required packages.
    * If typescript not present then install using $ npm i typescript -g


## Environments

    Start development:
    
    1. navigate to project directory.
    2. run proxy server using  $npm start.
    3. run ionic dev server using $ionic serve


## Pre - Build Instructions

    1. copy custom_modules/libVLC/ios and replace in plugins/cordova-plugin-rtsp-vlc/src/ios 
    2. copy custom_modules/libVLC/android/ and replace in plugins/cordova-plugin-rtsp-vlc/src/android/com/libVLC
    3. copy custom_modules/libVLC/res and replace in plugins/cordova-plugin-rtsp-vlc/src/android/res
    4. Befre building ios do pod install in platforms/ios/