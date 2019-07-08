import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView, createStackNavigator, createAppContainer } from 'react-navigation';

import RF from 'react-native-responsive-fontsize';
import shareIcon from '../../assets/icons8-share-64.png';
import infoIcon from '../../assets/icons8-info-52.png';

import { VotesCarousel } from '../VotesCarousel';
import NewsScreen from './NewsScreen';
import AuthorsScreen from './AuthorsScreen';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const config = require('../../../config.json');

class VotingResultsScreen extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    const screenProps = navigation.getParam('screenProps', {});
    const { reloadCards } = screenProps;
    reloadCards();
  }

  onShare = topVotes => {
    const shareMessage =
      Platform.OS === 'ios'
        ? {
            title: 'meuParlamento | Descobre quem vota como tu!',
            message: `Os partidos que mais concordaram comigo: ${topVotes
              .join(' | ')
              .replace('_', '-')}`,
            url: 'http://meuparlamento.pt',
          }
        : {
            message: `meuParlamento | Descobre quem vota como tu!\nOs partidos que mais concordaram comigo: ${topVotes
              .join(' | ')
              .replace('_', '-')}\nFaz download também em http://meuparlamento.pt`,
          };
    return async () => {
      try {
        const result = await Share.share(shareMessage);
      } catch (error) {
        alert(error.message);
      }
    };
  };

  renderPartyLogos = winnerPartyArr => {
    return winnerPartyArr
      .map((winner, i) => {
        switch (winner) {
          case 'PS':
            return (
              <Image
                key={i}
                source={require('../../assets/logos/PS.png')}
                style={styles.partyLogoImg}
              />
            );
          case 'PSD':
            return (
              <Image
                key={i}
                source={require('../../assets/logos/PSD.png')}
                style={styles.partyLogoImg}
              />
            );
          case 'BE':
            return (
              <Image
                key={i}
                source={require('../../assets/logos/BE.png')}
                style={styles.partyLogoImg}
              />
            );
          case 'PEV':
            return (
              <Image
                key={i}
                source={require('../../assets/logos/PEV.png')}
                style={styles.partyLogoImg}
              />
            );
          case 'PCP':
            return (
              <Image
                key={i}
                source={require('../../assets/logos/PCP.png')}
                style={styles.partyLogoImg}
              />
            );
          case 'CDS_PP':
            return (
              <Image
                key={i}
                source={require('../../assets/logos/CDS_PP.png')}
                style={styles.partyLogoImg}
              />
            );
          case 'PAN':
            return (
              <Image
                key={i}
                source={require('../../assets/logos/PAN.png')}
                style={styles.partyLogoImg}
              />
            );
          default:
            return null;
        }
      })
      .slice(0, 3);
  };

  playAgain() {
    const { navigation } = this.props;
    navigation.navigate('Home', { newGame: true });
  }

  goToAbout = () => {
    const { navigation } = this.props;
    navigation.navigate('About');
  };

  renderAboutButton = () => {
    return (
    <TouchableOpacity style={styles.btnTop} onPress={() => this.goToAbout()}>
      <Image source={infoIcon} style={styles.btnIcon} />
    </TouchableOpacity>
    )
  }

  renderShareButton = (topVotes) => {
    return (
    <TouchableOpacity style={styles.btnTop} onPress={this.onShare(topVotes)}>
      <Image source={shareIcon} style={styles.btnIcon} />
    </TouchableOpacity> 
    )
  }

  render() {
    const { navigation } = this.props;
    const screenProps = navigation.getParam('screenProps', {});
    const { votes, cards, reloadCards } = screenProps;

    let data = [
      {
        name: 'PCP',
        votes: votes.PCP > 0 ? votes.PCP : 0,
        color: '#db9c83',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'PEV',
        votes: votes.PEV > 0 ? votes.PEV : 0,
        color: '#c2db83',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'BE',
        votes: votes.BE > 0 ? votes.BE : 0,
        color: '#db8396',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'PS',
        votes: votes.PS > 0 ? votes.PS : 0,
        color: '#83c2db',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'PSD',
        votes: votes.PSD > 0 ? votes.PSD : 0,
        color: '#8396db',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'CDS-PP',
        votes: votes.CDS_PP > 0 ? votes.CDS_PP : 0,
        color: '#9c83db',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'PAN',
        votes: votes.PAN > 0 ? votes.PAN : 0,
        color: '#9c83db',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ];

    // show olny items with votes
    data = data.filter(row => row.votes > 0);

    const votesArray = Object.keys(votes);
    const maxVotesValue = votes[votesArray.reduce((a, b) => (votes[a] > votes[b] ? a : b))];
    const topVotes = votesArray.filter(key => votes[key] === maxVotesValue);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={[{ flex: 0.8 }, styles.containerTitle]}>Resultados</Text>
          {this.renderShareButton(topVotes)}
          {this.renderAboutButton()}
        </View>
        <View style={styles.subTitleContainer}>
          <Text style={styles.containerSubtitle}>Quem votou contigo</Text>
        </View>
        <View style={styles.logoContainer}>
          {topVotes.length === 0 ? (
            <Text style={styles.noVotesText}>Nenhum partido votou como tu</Text>
          ) : (
            this.renderPartyLogos(topVotes)
          )}
        </View>
        <View style={[styles.subTitleContainer, { flex: 0.1, justifyContent: 'center' }]}>
          <Text style={styles.containerSubtitle}>Os teus votos</Text>
        </View>
        <View style={styles.carouselContainer}>
          <VotesCarousel
            navigation={navigation}
            screenWidth={SCREEN_WIDTH}
            screenHeight={SCREEN_HEIGHT}
            cards={cards}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => this.playAgain(reloadCards)}>
            <Text style={styles.btn}>Jogar outra vez</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 30 : 0
  },

  logoContainer: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  partyLogoImg: {
    flex: 1,
    width: RF(13),
    height: RF(13),
    resizeMode: 'contain',
    marginHorizontal: 15,
  },

  titleContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 16,
  },

  containerTitle: {
    fontFamily: 'AirbnbCerealApp-ExtraBold',
    fontSize: 28,
    color: '#1e1e1e',
  },

  subTitleContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },

  containerSubtitle: {
    fontFamily: 'AirbnbCerealApp-Bold',
    fontSize: 20,
    color: '#1e1e1e',
    marginLeft: 16,
  },

  carouselContainer: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 0,
    marginVertical: 0,
    paddingTop: 0,
    marginTop: 0,
  },

  buttonContainer: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btn: {
    fontFamily: 'AirbnbCerealApp-Medium',
    fontSize: 16,
    fontWeight: '800',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 4,
    color: '#1e1e1e',
    margin: 8,
  },
  btnTop: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: RF(1.2),
  },
  btnIcon: {
    height: RF(4),
    width: RF(4),
  },
  noVotesText: {
    fontFamily: 'AirbnbCerealApp-Bold',
    fontSize: 16,
    color: '#1e1e1e',
  },
});

export default ResultsNavigator = createStackNavigator(
  {
    VotingsScreen: {
      screen: VotingResultsScreen,
      navigationOptions: {
        header: null,
      },
    },
    News: {
      screen: NewsScreen,
    },
    Authors: {
      screen: AuthorsScreen,
    },
    initialRouteName: 'VotingsScreen',
  },
  {
    headerMode: 'screen',
    mode: 'card',
  }
);
