import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
export default Spinner = ({children, horizontal}) => {
  return (
    <View
      style={[
        { height: SCREEN_HEIGHT, width: SCREEN_WIDTH },
        styles.container,
        horizontal ? styles.horizontal : null,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',

    alignItems: 'stretch',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
