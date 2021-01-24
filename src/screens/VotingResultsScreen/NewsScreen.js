import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import ItemLinkList  from '../../components/ItemsLinkList';
const config = require('../../../config.json');

export default class NewsScreen extends Component {
  static navigationOptions = {
    title: 'Notícias',
    headerTitleStyle: {
      flex: 0.8,
      textAlign: 'center',
  },
  };
    constructor(props) {
      super(props);
      const { navigation } = this.props;
      const proposalId = navigation.getParam('proposalId', 'NO-ID');
      const proposalDate = navigation.getParam('proposalDate', 'some default value');
      this.state = {
        newsUrl: `${config.api.news.url}/${proposalId}/${proposalDate}`
      }
  }
  render() {
    return (
      <SafeAreaView>
        <ItemLinkList url={this.state.newsUrl}/>
      </SafeAreaView>
    )
  }
}

