import React, { Component } from 'react'
import { SafeAreaView } from 'react-navigation';
import ItemLinkList from '../../components/ItemsLinkList';

const config = require('../../../config.json');

export default class AuthorsScreen extends Component {
  static navigationOptions = {
    title: 'Autores',
    headerTitleStyle: {
      flex: 0.8,
      textAlign: 'center',
  },
  };

    constructor(props) {
      super(props);
      const { navigation } = this.props;
      const proposalId = navigation.getParam('proposalId', 'NO-ID');
      this.state = {
        authorsUrl: `${config.api.authors.url}/${proposalId}`
      }
  }
  render() {
    return (
      <SafeAreaView>
        <ItemLinkList url={this.state.authorsUrl}/>
      </SafeAreaView>
    )
  }
}

