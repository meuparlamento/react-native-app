import React, { Component } from 'react';
// import AppScreen from './src';
import Routes from './src/config/routes';
import { useScreens } from 'react-native-screens';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import handleCustomTransition from './src/config/transitions';
import Reducers from './src/reducers';

useScreens();

const store = createStore(Reducers);

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
