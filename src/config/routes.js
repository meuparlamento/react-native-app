import VotingResults from '../components/VotingResults';
import DisclaimerScreen from '../components/Disclaimer';
import ErrorScreen from '../components/ErrorScreen';
import SummaryScreen from '../components/Summary';
import IntroScreen from '../components/IntroScreen';
import AboutScreen from '../components/AboutScreen';
import CardGameScreen from '../components/CardGameScreen';
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
  };

export default Routes;