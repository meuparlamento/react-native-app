import React, { Component } from 'react';
import { Text, TouchableOpacity} from 'react-native';
import { withNavigation, SafeAreaView } from 'react-navigation';
import Image from 'react-native-scalable-image';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { bindActionCreators } from 'redux';


class ErrorScreen extends Component {

  tryAgain(){
    const { navigation, thunkGetCards } = this.props;
    thunkGetCards(10);
    navigation.navigate('Home');
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32}}>
        <Image width={200} source={require('../../assets/connection_lost.gif')} />
        <Text style={{fontFamily: 'AirbnbCerealApp-Medium', fontSize: 24, textAlign: 'center', marginTop: 24}}>Estamos com problemas nos nossos serviços</Text>
        <TouchableOpacity style={{paddingVertical: 12, paddingHorizontal: 12,backgroundColor: '#8096f6', borderRadius: 8, marginTop: 24}} onPress={() => this.tryAgain()}>
          <Text style={{fontFamily: 'AirbnbCerealApp-Medium', fontSize: 16, textAlign: 'center', color: 'white'}}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = store => ({
  isErrorFetchingCards: store.cardsReducer.isError,
});

const mapDispatchToProps = dispatch => (
bindActionCreators(actions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ErrorScreen));
