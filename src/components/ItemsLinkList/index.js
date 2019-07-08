import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RF from 'react-native-responsive-fontsize';

export default class NewsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      data: [],
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
    this.setState({ modalMessage: 'A procurar informações relacionadas ...' });
  }

  makeRemoteRequest = () => {
    this.setState({ loading: true });
    this.fetchData(this.state.url);
  };

  fetchData(url) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    fetch(url, {
      method: 'GET',
      headers,
      mode: 'cors',
      cache: 'default',
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.data,
          error: res.error || null,
          loading: false,
        });

        if (res.response === 0) {
          this.setState({
            modalMessage: 'Não existem informações disponíveis sobre esta proposta',
          });
        }
      })
      .catch(error => {
        this.setState({ error, loading: false });
        this.setState({ modalMessage: 'Não existem informações disponíveis sobre esta proposta' });
      });
  }

  openURL = url => {
    return () => {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    };
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
          marginVertical: 5,
        }}
      />
    );
  };

  render() {
    return this.state.data.length > 0 ? (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItemContainer} onPress={this.openURL(item.url)}>
            <View style={styles.textContainer}>
              <Text style={styles.listItemTitle}>{item.title}</Text>
              <Text style={styles.listItemDescription}>
                {item.domain} | {moment(item.tstamp, 'YYYYMMDDHHmmss').format('DD/MM/YYYY')}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                style={{ backgroundColor: 'transparent' }}
                name="chevron-right"
                size={35}
                color="#a5a5a5"
              />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => `${item.id}`}
        ItemSeparatorComponent={this.renderSeparator}
      />
    ) : (
      <View style={{
        height: Dimensions.get('screen').height,
        // flex: 1,
        paddingHorizontal: RF(5),
        alignItems: 'center', 
        justifyContent: 'center'
        }}>
        <ActivityIndicator size="large" color="#8096f6" />
        <TouchableOpacity
        style={{
          ...styles.listItemContainer,
          // flex: 5,
          // justifyContent: 'center',
          // alignItems: 'center',
        }}
        onPress={this.props.closeModal}
      >
        <Text style={{ ...styles.listItemTitle, fontSize: 18, textAlign: 'center' }}>{this.state.modalMessage}</Text>
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 0.9,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 15,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  listItemTitle: {
    fontFamily: 'AirbnbCerealApp-Bold',
    fontSize: 14,
  },
  listItemDescription: {
    fontFamily: 'AirbnbCerealApp-Medium',
    fontSize: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
