import React from 'react'
import {
  View,
} from 'react-native'
import Navigation from './navigation';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {

  return (
    <NavigationContainer>
      <Navigation/>
    </NavigationContainer>
  );
};

export default App;