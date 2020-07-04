import React, { Component } from 'react'
import { Text, ScrollView, Dimensions} from 'react-native'
import { SafeAreaView } from 'react-navigation';
import RF from 'react-native-responsive-fontsize';

const config = require('../../../config.json');
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class DisclaimerScreen extends Component {

  static navigationOptions = {
    title: 'Disclaimer',
    headerTitleStyle: {
      flex: 0.8,
      textAlign: 'center',
  },
  };

  render() {
    return (
      <SafeAreaView>
        <ScrollView style={{height: SCREEN_HEIGHT, paddingHorizontal: RF(2), paddingVertical: RF(2)}}>
          <Text style={{ flex: 1, fontSize: RF(2), fontFamily: 'AirbnbCerealApp-Book' }}>
            {config.appInfo.disclaimer}
          </Text>
        </ScrollView>      
      </SafeAreaView>
    )
  }
}