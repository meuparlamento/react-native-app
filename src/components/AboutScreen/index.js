import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native'
import { withNavigation } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';


class AboutScreen extends Component {
  options = {
    data: [
      {
        title: 'Introdução',
        screen: 'Intro'
      },
      {
        title: 'Disclaimer',
        screen: 'Disclaimer'
      },
      {
        title: 'Ver site',
        screen: 'http://meuparlamento.pt'
      }
    ]
  }

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

  openURL = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  onDone() {
    const { navigation } = this.props;
    navigation.navigate('About');
  }

  navigateTo(screen){
    if(screen.startsWith('http')){
      this.openURL(screen);
    } else {
      const { navigation } = this.props;
      navigation.navigate(screen);
    }
  }

  render() {
    return (
      <FlatList
      data={this.options.data}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.listItemContainer} onPress={() => this.navigateTo(item.screen)}>
          <View style={styles.textContainer}>
            <Text style={styles.listItemTitle}>{item.title}</Text>
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
      keyExtractor={item => `${item.title}`}
      ItemSeparatorComponent={this.renderSeparator}
    />
    )
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
    justifyContent: 'center',
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

export default withNavigation(AboutScreen);
