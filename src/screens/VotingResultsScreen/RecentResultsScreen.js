// --------------- LIBRARIES ---------------
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, createStackNavigator } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';

// --------------- ASSETS ---------------
import NewsScreen from './NewsScreen';
import AuthorsScreen from './AuthorsScreen';
import shareIcon from '../../assets/icons8-share-64.png';
import infoIcon from '../../assets/icons8-info-52.png';
import { thunkGetCards, clearRecentProposalData } from '../../actions';

// --------------- CLASS DECLARATION ---------------
class RecentResultsScreen extends React.Component {
    // --------------- LIFECYCLE ---------------
    componentDidMount() {
        thunkGetCards();
    }

    // --------------- METHODS ---------------
    goToHome() {
        const { navigation } = this.props;
        navigation.navigate('Home', { newGame: true });
    }

    // --------------- RENDER ---------------
    render() {
        const { navigation } = this.props;
        const screenProps = navigation.getParam('screenProps', {});
        const { votes, cards } = screenProps;
        console.log(this.props);

        const votesArray = Object.keys(votes);
        const maxVotesValue = votes[votesArray.reduce((a, b) => (votes[a] > votes[b] ? a : b))];
        const topVotes = votesArray.filter(key => votes[key] === maxVotesValue);

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Animatable.Text animation='slideInRight' style={[{ flex: 0.8 }, styles.containerTitle]}>Resultados</Animatable.Text>
                </View>
                <View style={styles.messageContainer}>
                    <Animatable.Text animation='fadeIn' style={styles.containerMessage}>Obrigado por votar na proposta. Iremos atualizá-lo assim que a votação estiver no ar.</Animatable.Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.goToHome()}>
                        <Animatable.Text animation='slideInUp' style={styles.btn}>Voltar</Animatable.Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
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
    titleContainer: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 16,
    },
    messageContainer: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerMessage: {
        fontFamily: 'AirbnbCerealApp-Bold',
        fontSize: 20,
        color: '#1e1e1e',
        marginHorizontal: 16,
        textAlign: 'center'
    },
    containerTitle: {
        fontFamily: 'AirbnbCerealApp-ExtraBold',
        fontSize: 28,
        color: '#1e1e1e',
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
});

const mapStateToProps = store => ({
    recentProposalData: store.proposalReducer.recentProposalData,
});

const mapDispatchToProps = {
    clearRecentProposalData,
}

const VotingsScreen = connect(mapStateToProps, mapDispatchToProps)(RecentResultsScreen);

const ResultsNavigator = createStackNavigator(
    {
      VotingsScreen: {
        screen: VotingsScreen,
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