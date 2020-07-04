import React from 'react';
import { ActivityIndicator } from 'react-native';
import ViewContainer from '../ViewContainer';
export default Spinner = () => {
  return (
    <ViewContainer horizontal> 
      <ActivityIndicator size="large" color="#8096f6" />
    </ViewContainer>

  );
};