import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';

import whiteLogo from '../../assets/white-logo.png';
import * as Animatable from "react-native-animatable";
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RF from 'react-native-responsive-fontsize';
import { withNavigation } from 'react-navigation';


class MainMenuScreen extends Component {
    render() {
      console.log('MainMenu', this.props);
        return (
            <View style={styles.container}>
            <StatusBar barStyle="dark-content" hidden={false} translucent />
            <LinearGradient
            colors={['#aab6f4', '#8396db']}
            style={styles.gradient}>
            <Animatable.Image animation="bounceIn" easing="ease-out-sine" source={whiteLogo} style={styles.logo}></Animatable.Image>
            <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => this.props.navigateTo('CardGame')}>
              <Animatable.Text animation="slideInDown" style={styles.menuItem}>Novo jogo</Animatable.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CardGame', { recentProposals: true })}>
              <Animatable.Text animation="slideInDown" style={styles.menuItem}>Propostas Recentes</Animatable.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigateTo('Intro')}>
            <Animatable.Text animation="slideInDown" style={styles.menuItem}>Como funciona</Animatable.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigateTo('About')}>
            <Animatable.Text animation="slideInDown" style={styles.menuItem}>Sobre nós</Animatable.Text>
            </TouchableOpacity> 
            </View>
            </LinearGradient>
          </View>
        )
    }
}

export default withNavigation(MainMenuScreen); 

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    logo: {
      flex: 0.3,
      width: RF(24),
      resizeMode: 'contain',
      marginTop: RF(10)
    },
    menuContainer: {
      flex: 0.3,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    menuItem: {
      color: '#ffff',
      fontFamily: 'AirbnbCerealApp-Bold',
      fontSize: RF(3.2)
    }
  });
