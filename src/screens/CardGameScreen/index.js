import React from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Image from 'react-native-remote-svg';

import { Asset } from 'expo-asset';
import { withNavigation } from 'react-navigation';
import { ProposalList }  from '../../components';
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
      recentProposals: false,
      id: null,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const recentProposals = navigation.getParam('recentProposals', false);
    const id = navigation.getParam('id', null);
    this.setState({ recentProposals, id });
    await this.reloadCards(recentProposals);
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
      useNativeDriver: true,
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
      // useNativeDriver: true,
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
      useNativeDriver: true,
    }).start(this.onCardSwiped(this.props.cards[activeIndex].id));
  };

  handleShowCardDetails = () => {
    const activeIndex = this.props.cards.findIndex(card => card.isActive);
    this.showCardDetails(this.props.cards[activeIndex].id);
  }

  handleVotes(cardIndex, userVote) {
    // console.log('userVote: ', userVote);
    const { cards } = this.props;
    const card = cards[cardIndex];
    const cardVotes = card.votes;

    card.userVote = userVote;

    const { votes } = this.state;
    for (const key in votes) {
      // console.log('key: ', key);
      // console.log('cardVotes: ', cardVotes[key]);
      if (votes.hasOwnProperty(key) && userVote === cardVotes[key]) {
        votes[key] = votes[key] + 1;
        // console.log('votes counted: ', votes[key])
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
    if (!this.state.recentProposals) {
      navigation.navigate('BatchResults', { screenProps });
      alert('batch results');
    } else if (this.state.recentProposals) {
      const data = {
        id: this.state.id,
        votes: this.state.votes,
        cards: this.props.cards,
      };
      this.props.setRecentProposalData(data);
      navigation.navigate('RecentResults', { screenProps });
    }
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

  swapProposalCard = async () => {
    if (this.state.newQuestionCredits > 0 && !this.props.isLoadingCards) {
      this.props.thunkReplaceCard(this.state.recentProposals);
      this.setState({
        newQuestionCredits: this.state.newQuestionCredits - 1,
      });
    }
  };

  render() {
    if (!this.props.isLoadingCards && this.props.isLoadingCards === false && this.isDoneVoting()) {
      this.navigateToResults();
    }
    return (
      <ViewContainer>
        <StatusBar barStyle="dark-content" hidden={false} translucent />
        <ProposalList
          cards={this.props?.cards ?? []}
          isLoadingCards={this.props.isLoadingCards}
          handleNopeSelect={this.handleNopeSelect}
          handleLikeSelect={this.handleLikeSelect}
          handleAbstenceSelect={this.handleAbstenceSelect}
          handleShowCardDetails={this.handleShowCardDetails}
          swapProposalCard={this.swapProposalCard}
          credits={this.state.newQuestionCredits}
        />
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
    recentProposalData: store.proposalReducer.recentProposalData,
  });

const mapDispatchToProps = dispatch => (
  bindActionCreators(actions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(CardGameScreen));
