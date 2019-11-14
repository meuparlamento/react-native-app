import React, { Component } from 'react'
import { Text } from 'react-native'
import { SafeAreaView, withNavigation } from 'react-navigation'
import  Intro  from '../Intro'

class IntroScreen extends Component {

  // onDone = null;

  constructor(props){
    super(props);
  }

  onDone = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  componentDidMount() {
    const { navigation } = this.props;
    const screenProps = navigation.getParam('screenProps', {});
    const { _onDoneIntro } = screenProps;
    this.onDone = _onDoneIntro || this.onDone;
  }

  render() {
    return (
        <Intro _onDone={this.onDone} />
    )
  }
}

export default withNavigation(IntroScreen);
