import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Image, StatusBar, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';

import RF from 'react-native-responsive-fontsize';
import { slides } from './slides';

export default class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'AirbnbCerealApp-Bold': require('../../assets/fonts/AirbnbCerealApp-Bold.ttf'),
      'AirbnbCerealApp-Medium': require('../../assets/fonts/AirbnbCerealApp-Medium.ttf'),
    });
    this.setState({ fontsLoaded: true });
  }

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  };

  _renderItem = props => (
    <LinearGradient
      style={[
        styles.mainContent,
        {
          width: props.width,
          height: Dimensions.get('screen').height,
        },
      ]}
      colors={props.colors}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 0.1, y: 1 }}
    >
      <Image style={styles.image} source={props.image} />
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </LinearGradient>
  );

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onDone={this.props._onDone}
      />
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: RF(45),
    height: RF(45),
    backgroundColor: 'transparent',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: RF(3.3),
    paddingVertical: RF(2.6),
    fontSize: RF(2.5),
    fontFamily: 'AirbnbCerealApp-Medium',
  },
  title: {
    fontSize: RF(3.5),
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'AirbnbCerealApp-Bold',
    paddingHorizontal: RF(1),
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
