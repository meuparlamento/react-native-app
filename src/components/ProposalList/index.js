// --------------- LIBRARIES ---------------
import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import * as Animatable from "react-native-animatable";
import ProgressBar from 'react-native-progress/Bar';

// --------------- ASSETS ---------------
import Card  from '../Card';
import Spinner from '../Spinner';
import CircleButton from '../CircleButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --------------- COMPONENT DECLARATION ---------------
export default ProposalList = ({
    cards, 
    isLoadingCards, 
    handleNopeSelect, 
    handleLikeSelect, 
    handleAbstenceSelect,
    handleShowCardDetails,
    swapProposalCard,
    credits
}) => {

  // --------------- METHODS ---------------
  const gameProgress = () => {
    return cards.findIndex(card => card.isActive) / cards.length;
  };

  const isDoneVoting = () => {
    return cards.findIndex(card => card.isActive) < 0;
  };

  // --------------- RENDER ---------------
  return (
    <>
      <Animatable.View animation='zoomInDown' duration={2500} style={styles.cardArea}>
        {isLoadingCards ? <Spinner/> : (
          cards.map((card, index) => {
            return (
              <Card
                key={card.id + index}
                {...card}
                handleNopeSelect={handleNopeSelect}
                handleLikeSelect={handleLikeSelect}
                handleAbstenceSelect={handleAbstenceSelect}
                handleShowCardDetails={handleShowCardDetails}
              />
            );
          })
          .reverse()
        )}
      </Animatable.View>
      {gameProgress() >= 0
        ? (
          <View style={styles.progressBarContainer}>
            <ProgressBar
              animated
              progress={gameProgress()}
              width={SCREEN_WIDTH - RF(10)}
              height={10}
              borderRadius={4}
              color={`rgba(${128}, ${150}, ${246}, ${gameProgress()})`}
              style={{ flex: 0.8, borderColor: 'transparent', zIndex: 0 }}
            />
            <Text style={{fontFamily: 'AirbnbCerealApp-Medium', color: '#8096f6',fontSize: RF(2.2)}}>{gameProgress() * 10}/{cards.length}</Text>
          </View>
        ) : null
      }
      {!isDoneVoting()
        ? (
          <View style={styles.btnContainer}>
            <View style={{ flex: 0.25, flexDirection: 'row', justifyContent: 'center' }}>
              <CircleButton variant="newProposal" small action={swapProposalCard} credits={credits}  />
            </View>
            <View style={{ flex: 0.75, flexDirection: 'row', justifyContent: 'flex-start' }}>
              {[
                {variant: 'cancel', action: handleNopeSelect},
                {variant: 'skip', action: handleAbstenceSelect},
                {variant: 'check', action: handleLikeSelect},
                ].map((e, i) => <CircleButton key={i} variant={e.variant} action={e.action} />)}
            </View>
          </View>
        ) : null
        }
    </>
  )
}

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
  btnContainer: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
})