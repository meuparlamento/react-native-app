import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import * as Animatable from "react-native-animatable";
import RF from 'react-native-responsive-fontsize';

import check from '../../assets/icons8-checkmark-128.png';
import cancel from '../../assets/icons8-cancel-128.png';
import skip from '../../assets/icons8-circled-yellow-128.png';
import newProposal from '../../assets/icons8-synchronize-128.png';

const NewQuestionButttonContent = ({credits}) => (
  <>
  <View style={{...{
    backgroundColor:
      credits === 0
          ? 'rgba(255,255,255,0.65)'
          : 'rgba(255,255,255,0)',},
      ...styles.newProposalBtnContainer}}>
    <Text style={styles.newProposalText}>
      {credits}
    </Text>
  </View>
  <Animatable.Image animation='zoomIn' source={newProposal} style={styles.btnIconSmall} />
  </>
);

const VoteButtonContent = ({ source }) => (
<Animatable.Image animation='zoomIn' source={source} style={styles.btnIcon} />
)
export default CircleButton = ({ action, variant = 'check', small = false, credits = 0 }) => {
  const iconSource = {
    check,
    skip,
    cancel,
    newProposal,
  }
 return (
  <TouchableOpacity style={small ? styles.btnSmall : styles.btn} onPress={() => action()}>
    {variant === 'newProposal' ? <NewQuestionButttonContent credits={credits} /> : <VoteButtonContent source={iconSource[variant]} />}
  </TouchableOpacity>
); 
}

const styles = StyleSheet.create({
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
  newProposalBtnContainer: {
      position: 'absolute',
      top: 0,
      left: '1.4%',
      right: 0,
      bottom: '1.5%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      borderRadius: RF(30),
  },
  newProposalText: {
    fontSize: RF(1.7),
    color: 'white',
    fontFamily: 'AirbnbCerealApp-Black',
  }
});