import React, { Component } from 'react';
import Routes from './src/config/routes';
import store, { persistor } from './src/store';
import { Provider } from 'react-redux';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import handleCustomTransition from './src/config/transitions';
import { PersistGate } from 'redux-persist/integration/react';

const AppNavigator = createStackNavigator(
  Routes,
  {
    transitionConfig: nav => handleCustomTransition(nav),
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return (      
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer/>
      </PersistGate>
    </Provider>
    ) 
  }
}
