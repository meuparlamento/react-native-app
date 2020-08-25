import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  AsyncStorage,
  StatusBar,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { bindActionCreators } from 'redux';

import Image from 'react-native-remote-svg';
import ProgressBar from 'react-native-progress/Bar';

import { Asset } from 'expo-asset';
import RF from 'react-native-responsive-fontsize';
import { withNavigation } from 'react-navigation';
import * as Animatable from "react-native-animatable";
import { Card, Spinner, CircleButton }  from '../../components';
import ViewContainer from '../../components/ViewContainer';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class CardGameScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      votes: {
        BE: 0,
        CDS_PP: 0,
        PCP: 0,
        PEV: 0,
        PS: 0,
        PSD: 0,
        PAN: 0,
      },
      newQuestionCredits: 3,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const recentProposals = navigation.getParam('recentProposals', {});
    console.log('------------------>', recentProposals);
    await this.reloadCards();
  }
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
    const card = this.props.cards.find(card => card.id === id);
    const { navigation } = this.props;
    const screenProps = {
      text: card.summary,
    };
    navigation.navigate('Summary', { screenProps });
  };

  handleNopeSelect = (dy = 0, position = false) => {
    if(this.props.isLoadingCards) {
      return
    }
    const activeIndex = this.props.cards.findIndex(card => card.isActive);
    if (activeIndex < 0) return;
    if (!position) {
      position = this.props.cards[activeIndex].position;
    }
    this.handleVotes(activeIndex, -1);
    Animated.spring(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: dy },
    }).start(this.onCardSwiped(this.props.cards[activeIndex].id));
  };

  handleAbstenceSelect = (dy = 0, dx = 0, position = false) => {
    if(this.props.isLoadingCards) {
      return
    }
    const activeIndex = this.props.cards.findIndex(card => card.isActive);
    if (activeIndex < 0) return;

    if (!position) {
      position = this.props.cards[activeIndex].position;
    }
    this.handleVotes(activeIndex, 0);
    Animated.spring(position, {
      toValue: { x: dx, y: -SCREEN_HEIGHT - 100 },
    }).start(this.onCardSwiped(this.props.cards[activeIndex].id));
  };

  handleLikeSelect = (dy = 0, position = false) => {
    if(this.props.isLoadingCards) {
      return
    }
    const activeIndex = this.props.cards.findIndex(card => card.isActive);
    if (activeIndex < 0) return;
    if (!position) {
      position = this.props.cards[activeIndex].position;
    }
    this.handleVotes(activeIndex, 1);
    Animated.spring(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: dy },
    }).start(this.onCardSwiped(this.props.cards[activeIndex].id));
  };

  handleShowCardDetails() {
    const activeIndex = this.props.cards.findIndex(card => card.isActive);
    this.showCardDetails(this.props.cards[activeIndex].id);
  }

  handleVotes(cardIndex, userVote) {
    const { cards } = this.props;
    const card = cards[cardIndex];
    const cardVotes = card.votes;

    card.userVote = userVote;

    const { votes } = this.state;
    for (const key in votes) {
      if (votes.hasOwnProperty(key) && userVote === cardVotes[key]) {
        votes[key] = votes[key] + 1;
      }
    }
    this.setState({ votes, cards });
  }

  navigateToResults() {
    const { navigation } = this.props;
      const screenProps = {
        votes: this.state.votes,
        cards: this.props.cards,
        navigation,
      };
      navigation.navigate('Results', { screenProps });
  }

  reloadCards = async (recentProposals = false) => {
    const votes = {
      BE: 0,
      CDS_PP: 0,
      PCP: 0,
      PEV: 0,
      PS: 0,
      PSD: 0,
      PAN: 0,
    };

    this.props.thunkGetCards(10, recentProposals);
    this.setState({newQuestionCredits: 3, votes});

    if(this.props.isErrorFetchingCards) {
      this.props.setOffline(true);
      this.navigateToError();
    }
  };

  navigateToError() {
    const { navigation } = this.props;
    navigation.navigate('Error', { screenProps });
  }

  goToHome() {
    const { navigation } = this.props;
    navigation.navigate('Home', { newGame: true });
  }

  isDoneVoting = () => {
    const cards = this.props.cards || [];
    return cards.findIndex(card => card.isActive) < 0;
  };

  appLaunched = async () => {
    try {
      const launched = await AsyncStorage.getItem('alreadyLaunched');
      return launched;
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
    const { cards } = this.props;
    return cards.findIndex(card => card.isActive) / cards.length;
  };

  swapProposalCard = async () => {
    if (this.state.newQuestionCredits > 0 && !this.props.isLoadingCards) {
      this.props.thunkReplaceCard();
      this.setState({
        newQuestionCredits: this.state.newQuestionCredits - 1,
      });
    }
  };

  VotingProgressBar = () => this.gameProgress() >= 0 ? (
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
    <Text style={{fontFamily: 'AirbnbCerealApp-Medium', color: '#8096f6',fontSize: RF(2.2)}}>{this.gameProgress() * 10}/{this.props.cards.length}</Text>
  </View>
  ): null;

  VotingButtons = () => !this.isDoneVoting() ? (
    <View style={styles.btnContainer}>
    <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center' }}>
      <CircleButton variant="newProposal" small action={this.swapProposalCard} credits={this.state.newQuestionCredits}  />
    </View>
    <View style={{ flex: 0.75, flexDirection: 'row', justifyContent: 'flex-start' }}>
      {[
        {variant: 'cancel', action: this.handleNopeSelect},
        {variant: 'skip', action: this.handleAbstenceSelect},
        {variant: 'check', action: this.handleLikeSelect},
        ].map((e, i) => <CircleButton key={i} variant={e.variant} action={e.action} />)}
    </View>
  </View>
  ) : null;

  render() {
    console.log('PROPS IN CARD GAME SCREEN', this.props.isLoadingCards, this.props.isLoadingCards, this.props.isErrorFetchingCards, this.props.cards.map(e => e.id));
    if (!this.props.isLoadingCards && this.props.isLoadingCards === false && this.isDoneVoting()) {
      this.navigateToResults();
    }
    const { cards } = this.props;
    return (
      <ViewContainer>
        <StatusBar barStyle="dark-content" hidden={false} translucent />
        <Animatable.View animation='zoomInDown' duration={2500} style={styles.cardArea}>
          {this.props.isLoadingCards ? <Spinner/> : (
            cards.map((card, index) => {
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
            .reverse()
          )}
        </Animatable.View>
        {this.VotingProgressBar()}
        {this.VotingButtons()}
      </ViewContainer>
    );
  }
}

const mapStateToProps = store => ({
    isOffline: store.appStatusReducer.isOffline,
    cards: store.cardsReducer.cards,
    isLoadingCards: store.cardsReducer.isLoadingCards,
    isLoadingSingleCard: store.cardsReducer.isLoadingSingleCard,
    isErrorFetchingCards: store.cardsReducer.isError,
  });

const mapDispatchToProps = dispatch => (
  bindActionCreators(actions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(CardGameScreen));

const styles = StyleSheet.create({
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
});
