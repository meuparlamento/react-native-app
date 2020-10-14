import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import Image from 'react-native-remote-svg';

import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { registerForPushNotificationsAsync } from './helpers/push-notifications.helper';
import { connect } from 'react-redux';
import * as actions from './actions';
import { bindActionCreators } from 'redux';
import MainMenuScreen from './screens/MainMenuScreen';

class HomeScreen extends React.Component {
  componentDidUpdate() {
    const { isAppReady, firstUse, isOffline } = this.props;
    
    if(isAppReady && firstUse) {
      this.navigateTo('Intro');
    }

    if(isOffline) {
      this.navigateTo('Error');
    }
  }

  loadResourcesAsync = async () => {
    const { setAppFirstUse } = this.props;
    try {
      const images = [
        require('./assets/icons8-cancel-128.png'),
        require('./assets/icons8-checkmark-128.png'),
        require('./assets/icons8-circled-yellow-128.png'),
        require('./assets/logos/BE.png'),
        require('./assets/logos/CDS_PP.png'),
        require('./assets/logos/PAN.png'),
        require('./assets/logos/PCP.png'),
        require('./assets/logos/PEV.png'),
        require('./assets/logos/PS.png'),
        require('./assets/logos/PSD.png'),
      ];
      const imagesPromise = this.cacheImages(images);
      const fontsPromise = Font.loadAsync({
        'AirbnbCerealApp-Black': require('./assets/fonts/AirbnbCerealApp-Black.ttf'),
        'AirbnbCerealApp-Bold': require('./assets/fonts/AirbnbCerealApp-Bold.ttf'),
        'AirbnbCerealApp-Book': require('./assets/fonts/AirbnbCerealApp-Book.ttf'),
        'AirbnbCerealApp-ExtraBold': require('./assets/fonts/AirbnbCerealApp-ExtraBold.ttf'),
        'AirbnbCerealApp-Light': require('./assets/fonts/AirbnbCerealApp-Light.ttf'),
        'AirbnbCerealApp-Medium': require('./assets/fonts/AirbnbCerealApp-Medium.ttf'),
      });
      await Promise.all([imagesPromise, fontsPromise]);
      const firstUse = !(await AsyncStorage.getItem('alreadyLaunched'));
      if (firstUse) {
       await registerForPushNotificationsAsync();
      }
      setAppFirstUse(firstUse);
    } catch (error) {
      console.log(error, '!!OFFLINE!!!');
      this.navigateTo('Error');
    }
  };

  cacheImages = (images) => {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }
  
  navigateTo = (screen) => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  render() {
    if (!this.props.isAppReady) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onFinish={() => this.props.setAppReady(true)}
        />
      );
    } else {
      return <MainMenuScreen navigateTo={this.navigateTo} />;
    }
  }
}
const mapStateToProps = store => ({
  isOffline: store.appStatusReducer.isOffline,
  isAppReady: store.appStatusReducer.isAppReady,
  firstUse: store.appStatusReducer.firstUse,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
