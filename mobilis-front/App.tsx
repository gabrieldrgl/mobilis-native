import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/router';

import Login from './src/pages/login'

export default function App() {
  return (
    <Login />
  );
}
