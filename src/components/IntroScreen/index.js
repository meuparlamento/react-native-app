import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import  Intro  from '../Intro';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';

class IntroScreen extends Component {
  
  _onDoneIntro = () => {
    const { navigation, setAppFirstUse } = this.props;
    AsyncStorage.setItem('alreadyLaunched', 'true')
    .then(alreadyLaunched => {
      console.log(alreadyLaunched);
      setAppFirstUse(false);
    });
    navigation.navigate('Home');
  };

  render() {
    return (
        <Intro _onDone={this._onDoneIntro} />
    )
  }
}

const mapStateToProps = store => ({
  isOffline: store.appStatusReducer.isOffline,
  firstUse: store.appStatusReducer.firstUse,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(IntroScreen));
