import VotingResultsScreen from '../screens/VotingResultsScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import ErrorScreen from '../screens/ErrorScreen';
import SummaryScreen from '../screens/SummaryScreen';
import IntroScreen from '../screens/IntroScreen';
import AboutScreen from '../screens/AboutScreen';
import CardGameScreen from '../screens/CardGameScreen';
import HomeScreen from '../index';

const Routes = {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    CardGame: {
      screen: CardGameScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    Results: {
      screen: VotingResultsScreen,
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
  };

export default Routes;