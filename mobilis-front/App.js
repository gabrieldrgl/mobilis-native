import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Map from './src/pages/map';
import Router from './src/router';

export default function App() {
  return (
    <NavigationContainer>
      <Router/>
    </NavigationContainer>
  );
}