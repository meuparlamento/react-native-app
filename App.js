import React, { Component } from 'react';
import Routes from './src/config/routes';
import store from './src/store';
import { useScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import handleCustomTransition from './src/config/transitions';

useScreens();

const AppNavigator = createStackNavigator(
  Routes,
  {
    transitionConfig: nav => handleCustomTransition(nav),
  }
);

AppContainer = createAppContainer(AppNavigator);
export default class App extends Component {
  render() {
    return (      
    <Provider store={store}>
      <AppContainer></AppContainer>
    </Provider>
    ) 
  }
}
