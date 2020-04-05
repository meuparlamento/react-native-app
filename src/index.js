import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  StatusBar,
} from 'react-native';
import Image from 'react-native-remote-svg';
import whiteLogo from './assets/white-logo.png'

import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Animatable from "react-native-animatable";
import { LinearGradient } from 'expo-linear-gradient';
import { registerForPushNotificationsAsync } from './helpers/push-notifications.helper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      firstUse: true,
      isAppReady: false,
    };
  }
  componentDidMount() {
    if(this.state.isAppReady && this.state.firstUse) {
      this.navigateToIntro();
    }
  }

  loadResourcesAsync = async () => {
    try {
      // load random cards
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
      // load custom font
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
      const alreadyLaunched = await this.appLaunched();
      if (!alreadyLaunched) {
        const registeredNotifications = await registerForPushNotificationsAsync();
      }
      // AsyncStorage.clear();
      this.setState({ firstUse: !alreadyLaunched });
    } catch (error) {
      console.log(error, '!!OFFLINE!!!');
      this.navigateToError();
    }
  };

  _onDoneIntro = () => {
    const { navigation } = this.props;
    AsyncStorage.setItem('alreadyLaunched', 'true').then(this.setState({ firstUse: false }));
    navigation.navigate('Home');
  };

  appLaunched = async () => {
    try {
      const launched = await AsyncStorage.getItem('alreadyLaunched');
      return launched;
    } catch (error) {
      return false;
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
  
  navigateToIntro = () => {
    const { navigation } = this.props;
    const screenProps = {
      _onDoneIntro: this._onDoneIntro,
    }
    navigation.navigate('Intro', {screenProps});
  };

  navigateTo = (screen) => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  render() {
    console.log(this.props);
    if (!this.state.isAppReady) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onFinish={() => this.setState({ isAppReady: true })}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" hidden={false} translucent />
          <LinearGradient
          colors={['#aab6f4', '#8396db']}
          style={styles.gradient}>
          <Animatable.Image animation="bounceIn" easing="ease-out-sine" source={whiteLogo} style={styles.logo}></Animatable.Image>
          <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => this.navigateTo('CardGame')}>
            <Animatable.Text animation="slideInDown" style={styles.menuItem}>Novo jogo</Animatable.Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.navigateTo('Intro')}>
          <Animatable.Text animation="slideInDown" style={styles.menuItem}>Como funciona</Animatable.Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.navigateTo('About')}>
          <Animatable.Text animation="slideInDown" style={styles.menuItem}>Sobre nós</Animatable.Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.setOffline(true)}>
          <Animatable.Text animation="slideInDown" style={styles.menuItem}>Set Offline</Animatable.Text>
          </TouchableOpacity>    
          </View>
          </LinearGradient>
        </View>
      );
    }
  }
}
const mapStateToProps = store => ({
  isOffline: store.appStatusReducer.isOffline,
  isAppReady: store.appStatusReducer.isAppReady
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    flex: 0.3,
    width: RF(24),
    resizeMode: 'contain',
    marginTop: RF(10)
  },
  menuContainer: {
    flex: 0.3,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuItem: {
    color: '#ffff',
    fontFamily: 'AirbnbCerealApp-Bold',
    fontSize: RF(3.2)
  }
});
