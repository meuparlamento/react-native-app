import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { material, iOSColors } from 'react-native-typography';
import RF from 'react-native-responsive-fontsize';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Card extends React.Component {
  startPress = null;

  constructor(props) {
    super(props);
    this.state = {
      cardText: props.text,
      proposalDetails: false,
    };
    this.position = this.props.position;
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    const defaultScale = this.props.isActive ? 0.9 : 0.85;
    this.nextCardScale = this.props.parentPosition
      ? this.props.parentPosition.x.interpolate({
          inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
          outputRange: [0.9, 0.85, 0.9],
          extrapolate: 'clamp',
        })
      : defaultScale;

    this.rotateAndTranslate = {
      transform: [
        { rotate: this.rotate },
        { scale: this.nextCardScale },
        ...this.position.getTranslateTransform(),
      ],
    };

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    this.nopeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    this.abstencaoOpacity = this.position.y.interpolate({
      inputRange: [-SCREEN_HEIGHT / 2, 0, SCREEN_HEIGHT / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });
  }

  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        this.startPress = evt.timeStamp;
        return this.props.isActive;
      },
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;

        const distance = () => Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        const noMovement = distance() < 10;

        if (dx > 150) {
          this.props.handleLikeSelect(gestureState.dy, this.position);
        } else if (dx < -150) {
          this.props.handleNopeSelect(gestureState.dy, this.position);
        } else if (dy > 150) {
          this.props.handleAbstenceSelect(gestureState.dy, this.position);
        } else if (dy < -150) {
          this.props.handleAbstenceSelect(gestureState.dy, this.position);
        } else if (noMovement) {
          this.props.handleShowCardDetails();
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: true,
          }).start();
        }
      },
    });
  }

  showProposalDetails() {
    this.setState({ proposalDetails: true });
  }

  showProposalContent() {
    this.setState({ proposalDetails: false });
  }

  renderProposalContent() {
    return (
      <React.Fragment>
        <LinearGradient
          colors={['#aab6f4', '#8396db']}
          style={styles.cardBackground}>
        <Text style={[material.headlineWhite, styles.materialCardDetailsWhiteTop]}>
          Como votavas?
        </Text>
        <Text style={[material.titleWhite, styles.materialCardTitleWhite]}>
          {this.state.cardText}
        </Text>
        <Text style={[material.headlineWhite, styles.materialCardDetailsWhite]}>
          Proposto em {this.props.voteDate.split('-')[0]}
        </Text>
        </LinearGradient>
      </React.Fragment>
    );
  }

  renderProposalDetails() {
    return (
      <React.Fragment>
        <Image style={styles.cardBackground} source={this.props.image} />
        <Text style={[material.titleWhite, styles.detailsText]}>{this.props.summary}</Text>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Animated.View
        {...this.PanResponder.panHandlers} // <----- This is what binds to the PanResponder's onPanResponderMove handler
        style={[this.rotateAndTranslate, styles.card]}
      >
        <Animated.View
          style={[
            styles.cardTextContainer,
            styles.cardTextContainerLike,
            { opacity: this.likeOpacity },
          ]}
        >
          <Text style={[styles.cardText, styles.cardTextLike]}>Sou a favor</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cardTextContainer,
            styles.cardTextContainerAbstencao,
            { opacity: this.abstencaoOpacity },
          ]}
        >
          <Text style={[styles.cardText, styles.cardTextAbstencao]}>Abstenção</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cardTextContainer,
            styles.cardTextContainerNope,
            { opacity: this.nopeOpacity },
          ]}
        >
          <Text style={[styles.cardText, styles.cardTextNope]}>Sou contra</Text>
        </Animated.View>
        {this.props.proposalDetails ? this.renderProposalDetails() : this.renderProposalContent()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  materialCardDetailsWhite: {
    color: iOSColors.white,
    fontSize: 15,
    textAlign: 'justify',
    position: 'absolute',
    fontFamily: 'AirbnbCerealApp-Medium',
    left: 30,
    right: 30,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  materialCardDetailsWhiteTop: {
    color: iOSColors.white,
    fontSize: 15,
    textAlign: 'left',
    position: 'absolute',
    fontFamily: 'AirbnbCerealApp-Medium',
    left: 30,
    right: 30,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  materialCardTitleWhite: {
    color: iOSColors.white,
    fontSize: RF(4.2),
    lineHeight: RF(4.6),
    textAlign: 'left',
    position: 'absolute',
    fontFamily: 'AirbnbCerealApp-Medium',
    top: RF(11),
    left: RF(4),
    right: RF(4),
    bottom: RF(9),
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailsText: {
    color: iOSColors.white,
    fontSize: RF(2),
    lineHeight: RF(2.4),
    textAlign: 'left',
    position: 'absolute',
    fontFamily: 'AirbnbCerealApp-Medium',
    top: RF(6),
    left: RF(4),
    right: RF(4),
    bottom: RF(7),
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardBackground: {
    borderRadius: 20,
    flex: 1,
  },

  card: {
    borderWidth: 0,
    position: 'absolute',
    height: '105%',
    width: SCREEN_WIDTH,
    borderWidth: 0,
  },

  textContainer: {
    height: 400,
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: '#5E76DE',
    backgroundColor: '#5E76DE',
  },

  cardTextContainer: {
    position: 'absolute',
    top: 45,
    zIndex: 999,
    borderRadius: 20,
    borderColor: '#5E76DE',
    borderWidth: 0,
  },

  cardText: {
    fontSize: 30,
    fontWeight: '800',
    padding: 10,
    borderRadius: 10,
  },

  cardTextContainerLike: {
    right: 50,
    transform: [{ rotate: '15deg' }],
  },

  cardTextLike: {
    color: '#4bdb79',
    fontSize: 40,
    borderColor: '#4bdb79',
    borderWidth: 4,
    borderRadius: 10,
    fontFamily: 'AirbnbCerealApp-Bold',
  },

  cardTextContainerAbstencao: {
    top: 400,
    transform: [{ rotate: '5deg' }],
  },

  cardTextAbstencao: {
    color: '#dbc883',
    fontSize: 40,
    borderColor: '#dbc883',
    borderWidth: 4,
    borderRadius: 10,
    fontFamily: 'AirbnbCerealApp-Bold',
  },

  cardTextContainerNope: {
    left: 50,
    transform: [{ rotate: '-15deg' }],
  },

  cardTextNope: {
    color: '#D80027',
    fontSize: 40,
    borderWidth: 4,
    borderColor: '#D80027',
    borderRadius: 10,
    fontFamily: 'AirbnbCerealApp-Bold',
  },
});
