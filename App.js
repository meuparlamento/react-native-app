import React, { Component } from 'react';
import App from './src';
import { useScreens } from 'react-native-screens';

useScreens();

export default class Main extends Component {
  render() {
    return <App/>
  }
}
