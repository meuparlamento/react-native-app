
# meuParlamento mobile app

![meuParlamentoCover](http://meuparlamento.pt/static/readme_header.jpeg)
> This project provides the mobile app source code to be used with the [backend-api](https://github.com/meuparlamento/meuparlamento-backend-api)
> 
An intuitive mobile app to improve political participation in Portugal.

### Requirements

* [Expo-CLI](https://docs.expo.io/versions/latest/workflow/expo-cli/)

## Installation

All the dependencies can be installed just running these commands

```sh
$ npm install -g expo-cli
```

```sh
$ npm install
```

## Configuration
In this repository you can find a [`config.json`](https://github.com/meuparlamento/react-native-app/blob/master/config.json) file that have to be fulfilled with the [backend-api](https://github.com/meuparlamento/meuparlamento-backend-api) endpoints url:
```json
{
  "api": {
    "proposals": {
      "url": "http://backend-url/batch"
    },
    "news": {
      "url": "http://backend-url/news"
    },
    "authors": {
      "url": "http://backend-url/authors"
    },
    "notifications": {
      "url": "http://backend-url/notifications"
    }
  }
}
```


## Running the app
This project is wrapped on a SDK called [Expo](https://expo.io/) on top of [React Native](https://facebook.github.io/react-native/)

In order to run it locally just type:

```sh
npm start 
```
 Then you have multiple options on where to run the App:
 

 - iOS Simulator bundled with Xcode
 - Android Simulator bundled with Android Studio
 - Android device running ADB mode with Android Studio
 - iOS or Android device with Expo App installed

## Build the app binaries
After you've finished your development you can generate binaries with the help of [Expo-CLI](https://docs.expo.io/versions/latest/workflow/expo-cli/)

For iOS:

```sh
expo build:ios
```

For Android:

```sh
expo build:android
```

## Meta

Team meuParlamento.pt dev@meuparlamento.pt

Distributed under the GPL license. See ``LICENSE`` for more information.

[https://github.com/meuparlamento](https://github.com/meuparlamento)

## Contributing

1. Fork it (<https://github.com/meuparlamento/react-native-app/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
