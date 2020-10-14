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
import { SafeAreaView, createStackNavigator } from 'react-navigation';
import { thunkGetCards } from '../../actions';
import store from '../../store';
import RF from 'react-native-responsive-fontsize';
import shareIcon from '../../assets/icons8-share-64.png';
import infoIcon from '../../assets/icons8-info-52.png';

import { VotesCarousel } from '../../components';
import NewsScreen from './NewsScreen';
import AuthorsScreen from './AuthorsScreen';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import * as Animatable from 'react-native-animatable';
class BatchResultsScreen extends React.Component {
  componentDidMount() {
    thunkGetCards()
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
    const logos = {
      PS: require('../../assets/logos/PS.png'),
      PSD: require('../../assets/logos/PSD.png'),
      BE: require('../../assets/logos/BE.png'),
      PEV: require('../../assets/logos/PEV.png'),
      PCP: require('../../assets/logos/PCP.png'),
      CDS_PP: require('../../assets/logos/CDS_PP.png'),
      PAN: require('../../assets/logos/PAN.png'),
      FALLBACK: require('../../assets/logos/PAN.png'),
    }
    return winnerPartyArr
      .map((winner, i) =>
        <Animatable.Image
        animation='zoomIn'
        key={i}
        source={logos[winner] || logos.FALLBACK}
        style={styles.partyLogoImg}
      />
      )
      .slice(0, 3);
  };

  goToHome() {
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
      <Animatable.Image animation='zoomIn' source={infoIcon} style={styles.btnIcon} />
    </TouchableOpacity>
    )
  }

  renderShareButton = (topVotes) => {
    return (
    <TouchableOpacity style={styles.btnTop} onPress={this.onShare(topVotes)}>
      <Animatable.Image animation='zoomIn' source={shareIcon} style={styles.btnIcon} />
    </TouchableOpacity> 
    )
  }

  render() {
    const { navigation } = this.props;
    const screenProps = navigation.getParam('screenProps', {});
    const { votes, cards } = screenProps;

    const votesArray = Object.keys(votes);
    const maxVotesValue = votes[votesArray.reduce((a, b) => (votes[a] > votes[b] ? a : b))];
    const topVotes = votesArray.filter(key => votes[key] === maxVotesValue);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Animatable.Text animation='slideInRight' style={[{ flex: 0.8 }, styles.containerTitle]}>Resultados</Animatable.Text>
          {this.renderShareButton(topVotes)}
          {this.renderAboutButton()}
        </View>
        <View style={styles.subTitleContainer}>
        <Animatable.Text animation='slideInRight' style={styles.containerSubtitle}>Quem votou contigo</Animatable.Text>
        </View>
        <View style={styles.logoContainer}>
          {topVotes.length === 0 ? (
            <Animatable.Text animation='slideInRight' style={styles.noVotesText}>Nenhum partido votou como tu</Animatable.Text>
          ) : (
            this.renderPartyLogos(topVotes)
          )}
        </View>
        <View style={[styles.subTitleContainer, { flex: 0.1, justifyContent: 'center' }]}>
        <Animatable.Text animation='slideInRight' style={styles.containerSubtitle}>Os teus votos</Animatable.Text>
        </View>
        <Animatable.View animation='fadeInRight' style={styles.carouselContainer}>
          <VotesCarousel
            navigation={navigation}
            screenWidth={SCREEN_WIDTH}
            screenHeight={SCREEN_HEIGHT}
            cards={cards}
          />
        </Animatable.View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => this.goToHome()}>
            <Animatable.Text animation='slideInUp' style={styles.btn}>Voltar</Animatable.Text>
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

const ResultsNavigator = createStackNavigator(
  {
    VotingsScreen: {
      screen: BatchResultsScreen,
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

export default ResultsNavigator;
