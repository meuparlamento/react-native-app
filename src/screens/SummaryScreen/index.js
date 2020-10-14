import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Platform,
} from 'react-native';
import { withNavigation, SafeAreaView } from 'react-navigation';
import RF from 'react-native-responsive-fontsize';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
class SummaryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const screenProps = navigation.getParam('screenProps', {});
    const { text } = screenProps;
    this.setState({ text });
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.goBack()}>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.textView}>
            <Text style={styles.textTitle}>Excerto da Proposta</Text>
            <Text style={styles.textWhiteSmall}> {this.state.text} </Text>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(SummaryScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8096f6',
    color: 'white',
  },
  textView: {
    height: SCREEN_HEIGHT,
    paddingHorizontal: RF(3),
    paddingTop: Platform.OS === 'android' ? RF(6) + 30 : RF(6) + 10,
  },
  textWhiteSmall: {
    color: 'white',
    fontFamily: 'AirbnbCerealApp-Medium',
    fontSize: RF(2.3),
  },
  textTitle: {
    color: 'white',
    fontFamily: 'AirbnbCerealApp-Bold',
    fontSize: RF(3.2),
    marginBottom: RF(1),
  },
});
