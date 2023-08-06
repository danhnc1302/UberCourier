import React from 'react'
import Navigation from './navigation';
import { NavigationContainer } from '@react-navigation/native';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native';
import AuthContextProvider from './src/contexts/AuthContext';
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disables: true,
  },
})

const App = () => {

  return (

    <NavigationContainer>
      <AuthContextProvider>
        <Navigation/>
      </AuthContextProvider>
    </NavigationContainer>
  );
};

export default withAuthenticator(App);