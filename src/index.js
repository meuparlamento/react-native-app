import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  AsyncStorage,
  StatusBar,
  Text,
} from 'react-native';
import Image from 'react-native-remote-svg';
import ProgressBar from 'react-native-progress/Bar';

import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import RF from 'react-native-responsive-fontsize';
import { createStackNavigator, createAppContainer } from 'react-navigation';
// import { FluidNavigator } from 'react-navigation-fluid-transitions';

import { fromLeft, zoomIn, zoomOut } from 'react-navigation-transitions';

import checkIcon from './assets/icons8-checkmark-128.png';
import cancelIcon from './assets/icons8-cancel-128.png';
import skipIcon from './assets/icons8-circled-yellow-128.png';
import newProposalIcon from './assets/icons8-synchronize-128.png';
import infoIcon from './assets/icons8-info-52.png';

import Card from './components/Card';

import gradientBlue from './assets/gradient_blue-02.png';
import gradientGray from './assets/gradient_gray-02.png';

import Intro from './components/Intro';
import { fetchCardData } from './helpers/api.helper';
import { registerForPushNotificationsAsync } from './helpers/push-notifications.helper';
import VotingResults from './components/VotingResults';
import DisclaimerScreen from './components/Disclaimer';
import ErrorScreen from './components/ErrorScreen';
import SummaryScreen from './components/Summary';
import IntroScreen from './components/IntroScreen';
import AboutScreen from './components/AboutScreen';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const config = require('../config.json');

const getCards = async quantity => {
  let cards = [];
  let lastItemPosition = false;
  try {
    // fetch proposals
    const data = await fetchCardData(`${config.api.proposals.url}/${quantity}`);
    cards = data.map(row => {
      const position = new Animated.ValueXY();

      const { BE, CDS_PP, PCP, PEV, PS, PSD, PAN } = row;
      const card = {
        image: gradientBlue,
        detailsBackground: gradientGray,
        position,
        parentPosition: lastItemPosition,
        id: row.IDProposal,
        text: row.Description,
        summary: row.Summary,
        voteDate: row.VoteDate,
        LinkPdf: row.LinkPdf,
        isActive: false,
        proposalDetails: false,
        votes: { BE, CDS_PP, PCP, PEV, PS, PSD, PAN },
        proposedBy: row.ProposedBy,
        result: row.Result,
        userVote: null,
      };
      lastItemPosition = position;
      return card;
    });
    cards[0].isActive = true;
    return cards;
  } catch (error) {
    throw error;
  }
};

class AppScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      cards: [],
      isLoading: true,
      votes: {
        BE: 0,
        CDS_PP: 0,
        PCP: 0,
        PEV: 0,
        PS: 0,
        PSD: 0,
        PAN: 0,
      },
      firstUse: true,
      isAppReady: false,
      isAppOffline: false,
      newQuestionCredits: 3,
    };
  }

  componentDidUpdate() {
    if (!this.state.isAppOffline && !this.state.isLoading) {
      this.navigateToResults();
    }
    if(!this.state.isAppOffline && !this.state.isLoading && this.state.firstUse ) {
      this.navigateToIntro();
    }
  }

  loadResourcesAsync = async () => {
    try {
      // load random cards
      const images = [
        require('./assets/icons8-cancel-128.png'),
        require('./assets/icons8-checkmark-128.png'),
        require('./assets/icons8-circled-yellow-128.png'),
        require('./assets/logos/BE.png'),
        require('./assets/logos/CDS_PP.png'),
        require('./assets/logos/PAN.png'),
        require('./assets/logos/PCP.png'),
        require('./assets/logos/PEV.png'),
        require('./assets/logos/PS.png'),
        require('./assets/logos/PSD.png'),
      ];
      // load custom font
      await this.cacheImages(images);
      await Font.loadAsync({
        'AirbnbCerealApp-Black': require('./assets/fonts/AirbnbCerealApp-Black.ttf'),
        'AirbnbCerealApp-Bold': require('./assets/fonts/AirbnbCerealApp-Bold.ttf'),
        'AirbnbCerealApp-Book': require('./assets/fonts/AirbnbCerealApp-Book.ttf'),
        'AirbnbCerealApp-ExtraBold': require('./assets/fonts/AirbnbCerealApp-ExtraBold.ttf'),
        'AirbnbCerealApp-Light': require('./assets/fonts/AirbnbCerealApp-Light.ttf'),
        'AirbnbCerealApp-Medium': require('./assets/fonts/AirbnbCerealApp-Medium.ttf'),
      });
      // await Promise.all(imagesPromise, fontsPromise);
      const alreadyLauched = await this.appLaunched();
      if (!alreadyLauched) {
        const registeredNotifications = await registerForPushNotificationsAsync();
      }
      const cards = await getCards(10);
      // AsyncStorage.clear();
      this.setState({ cards, isLoading: false, firstUse: !alreadyLauched, isAppOffline: false });
    } catch (error) {
      console.log(error, '!!OFFLINE!!!');
      this.setState({ isAppOffline: true });
      this.navigateToError();
    }
  };

  onCardSwiped = id => {
    this.setState(prevState => {
      const swipedIndex = prevState.cards.findIndex(card => card.id === id);
      const isLastIndex = swipedIndex === prevState.cards.length - 1;
      const nextIndex = swipedIndex + 1;
      const newState = { ...prevState };
      newState.cards[swipedIndex].isActive = false;
      if (isLastIndex) return prevState;
      newState.cards[nextIndex].isActive = true;
      return newState;
    });
  };

  showCardDetails = id => {
    const card = this.state.cards.find(card => card.id === id);
    const { navigation } = this.props;
    const screenProps = {
      text: card.summary,
    };
    navigation.navigate('Summary', { screenProps });
  };

  handleNopeSelect = (dy = 0, position = false) => {
    if(this.state.isLoading) {
      return
    }
    const activeIndex = this.state.cards.findIndex(card => card.isActive);
    if (activeIndex < 0) return;
    if (!position) {
      position = this.state.cards[activeIndex].position;
    }
    this.handleVotes(activeIndex, -1);
    Animated.spring(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: dy },
    }).start(this.onCardSwiped(this.state.cards[activeIndex].id));
  };

  handleAbstenceSelect = (dy = 0, dx = 0, position = false) => {
    if(this.state.isLoading) {
      return
    }
    const activeIndex = this.state.cards.findIndex(card => card.isActive);
    if (activeIndex < 0) return;

    if (!position) {
      position = this.state.cards[activeIndex].position;
    }
    this.handleVotes(activeIndex, 0);
    Animated.spring(position, {
      toValue: { x: dx, y: -SCREEN_HEIGHT - 100 },
    }).start(this.onCardSwiped(this.state.cards[activeIndex].id));
  };

  handleLikeSelect = (dy = 0, position = false) => {
    if(this.state.isLoading) {
      return
    }
    const activeIndex = this.state.cards.findIndex(card => card.isActive);
    if (activeIndex < 0) return;
    if (!position) {
      position = this.state.cards[activeIndex].position;
    }
    this.handleVotes(activeIndex, 1);
    Animated.spring(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: dy },
    }).start(this.onCardSwiped(this.state.cards[activeIndex].id));
  };

  handleShowCardDetails() {
    const activeIndex = this.state.cards.findIndex(card => card.isActive);
    this.showCardDetails(this.state.cards[activeIndex].id);
  }

  handleVotes(cardIndex, userVote) {
    const { cards } = this.state;
    const card = cards[cardIndex];
    const cardVotes = card.votes;

    card.userVote = userVote;

    const { votes } = this.state;
    for (const key in votes) {
      if (votes.hasOwnProperty(key) && userVote === cardVotes[key]) {
        votes[key] = votes[key] + 1;
      }
    }
    this.setState({ cards, votes });
  }

  navigateToResults() {
    const { navigation } = this.props;
    if (this.isEmptyState()) {
      const screenProps = {
        votes: this.state.votes,
        cards: this.state.cards,
        reloadCards: this.reloadCards,
        navigation,
      };
      navigation.navigate('Results', { screenProps });
    }
  }

  renderCards = cards => {
    return cards
      .map((card, index) => {
        return (
          <Card
            key={card.id + index}
            {...card}
            handleNopeSelect={this.handleNopeSelect}
            handleLikeSelect={this.handleLikeSelect}
            handleAbstenceSelect={this.handleAbstenceSelect}
            navigation={this.props.navigation}
          />
        );
      })
      .reverse();
  };

  reloadCards = async () => {
    const votes = {
      BE: 0,
      CDS_PP: 0,
      PCP: 0,
      PEV: 0,
      PS: 0,
      PSD: 0,
      PAN: 0,
    };
    try {
      this.setState({ isLoading: true, votes });
      const cards = await getCards(10);
      this.setState({ cards, isLoading: false, isAppOffline: false, newQuestionCredits: 3 });
    } catch (error) {
      console.log(error, '!!OFFLINE!!!');
      this.setState({ isAppOffline: true });
      this.navigateToError();
    }
  };

  navigateToError() {
    const { navigation } = this.props;
    const screenProps = {
      reloadCards: this.reloadCards,
    };
    navigation.navigate('Error', { screenProps });
  }

  renderSpinner = () => {
    return (
      <View
        style={[
          { height: SCREEN_HEIGHT, width: SCREEN_WIDTH },
          styles.container,
          styles.horizontal,
        ]}
      >
        <ActivityIndicator size="large" color="#8096f6" />
      </View>
    );
  };

  isEmptyState = () => {
    const cards = this.state.cards || [];
    return cards.findIndex(card => card.isActive) < 0;
  };

  _onDoneIntro = () => {
    const { navigation } = this.props;
    AsyncStorage.setItem('alreadyLaunched', 'true').then(this.setState({ firstUse: false }));
    navigation.navigate('Home');
  };

  appLaunched = async () => {
    try {
      const lauched = await AsyncStorage.getItem('alreadyLaunched');
      return lauched;
    } catch (error) {
      return false;
    }
  };

  cacheImages = (images) => {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }
  

  gameProgress = () => {
    const { cards } = this.state;
    return cards.findIndex(card => card.isActive) / cards.length;
  };

  goToAbout = () => {
    const { navigation } = this.props;
    navigation.navigate('About');
  };

  renderAboutButton = () => {
    return (
    <TouchableOpacity style={{position: 'absolute', right: RF(3), bottom: RF(4)}} onPress={() => this.goToAbout()}>
      <Image source={infoIcon} style={{width: RF(3), height: RF(3)}} />
    </TouchableOpacity>
    )
  }

  navigateToIntro = () => {
    const { navigation } = this.props;
    const screenProps = {
      _onDoneIntro: this._onDoneIntro,
    }
    navigation.navigate('Intro', {screenProps});
  };

  swapProposalCard = async () => {
    if (this.state.newQuestionCredits > 0 && !this.state.isLoading) {
      this.setState({ isLoading: true });
      const newCard = await getCards(1);
      const { cards } = this.state;
      const newCards = cards.map(card => {
        if (card.isActive) {
          return newCard.find(card => card !== null || card !== undefined);
        }
        return card;
      });
      this.setState({
        newQuestionCredits: this.state.newQuestionCredits - 1,
        cards: newCards,
        isLoading: false,
      });
    }
  };

  renderCardGame = () => {
    return (
      <React.Fragment>
        <View style={styles.cardArea}>
          {this.state.isLoading ? this.renderSpinner() : this.renderCards(this.state.cards)}
        </View>
      { this.gameProgress() >= 0 ? (
        <View style={styles.progressBarContainer}>
        <ProgressBar
          animated
          progress={this.gameProgress()}
          width={SCREEN_WIDTH - RF(10)}
          height={10}
          borderRadius={4}
          color={`rgba(${128}, ${150}, ${246}, ${this.gameProgress()})`}
          style={{ flex: 0.8, borderColor: 'transparent', zIndex: 0 }}
        />
        <Text style={{fontFamily: 'AirbnbCerealApp-Medium', color: '#8096f6',fontSize: RF(2.2)}}>{this.gameProgress() * 10}/{this.state.cards.length}</Text>
      </View>
      ): null }
        {!this.isEmptyState() ? (
          <View style={styles.btnContainer}>
            <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity style={styles.btnSmall} onPress={() => this.swapProposalCard()}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '1.4%',
                    right: 0,
                    bottom: '1.5%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                    backgroundColor:
                      this.state.newQuestionCredits === 0
                        ? 'rgba(255,255,255,0.65)'
                        : 'rgba(255,255,255,0)',
                    borderRadius: RF(30),
                  }}
                >
                  <Text
                    style={{
                      fontSize: RF(1.7),
                      color: 'white',
                      fontFamily: 'AirbnbCerealApp-Black',
                    }}
                  >
                    {this.state.newQuestionCredits}
                  </Text>
                </View>
                <Image source={newProposalIcon} style={styles.btnIconSmall} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.75, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <TouchableOpacity style={styles.btn} onPress={() => this.handleNopeSelect()}>
                <Image source={cancelIcon} style={styles.btnIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => this.handleAbstenceSelect()}>
                <Image source={skipIcon} style={styles.btnIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => this.handleLikeSelect()}>
                <Image source={checkIcon} style={styles.btnIcon} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </React.Fragment>
    );
  };

  render() {
    if (!this.state.isAppReady) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onFinish={() => this.setState({ isAppReady: true })}
        />
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" hidden={false} translucent />
        {/* {this.state.firstUse ? this.navigateToIntro() : this.renderCardGame()} */}
        {this.renderCardGame()}
        {/* {this.renderAboutButton()} */}
      </View>
    );
  }
}

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (
    prevScene &&
    prevScene.route.routeName === 'Home' &&
    nextScene.route.routeName === 'Summary'
  ) {
    return zoomIn();
  }
  if (
    prevScene &&
    prevScene.route.routeName === 'Summary' &&
    nextScene.route.routeName === 'Home'
  ) {
    return zoomOut();
  }
  return fromLeft();
};

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: AppScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    Results: {
      screen: VotingResults,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    Disclaimer: {
      screen: DisclaimerScreen,
    },
    Summary: {
      screen: SummaryScreen,
      navigationOptions: {
        header: null,
      },
    },
    Intro: {
      screen: IntroScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    },
    About: {
      screen: AboutScreen,
    },
    Error: {
      screen: ErrorScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    initialRouteName: 'Home',
  },
  {
    transitionConfig: nav => handleCustomTransition(nav),
  }
);

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',

    alignItems: 'stretch',
  },
  cardArea: {
    flex: 8,
    marginTop: 30,
    zIndex: 100,
  },
  progressBarContainer: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    color: 'rgba(128, 150, 246, 1)',
  },
  btnContainer: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  btn: {
    height: RF(8.5),
    width: RF(8.5),
    borderRadius: RF(50),
    marginHorizontal: RF(0.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efefef',
  },
  btnIcon: {
    height: RF(9),
    width: RF(9),
  },
  btnIconSmall: {
    height: RF(6.75),
    width: RF(6.75),
  },
  btnSmall: {
    height: RF(6.95),
    width: RF(6.95),
    borderRadius: RF(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: '#efefef',
  },
});
