import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerRouter, StackRouter } from './src/router';

export default function App() {
  
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const handleLoginChange = (loggedIn: boolean) => {
    setIsLogged(loggedIn);
  };

  return (
    <NavigationContainer>
      {isLogged ? <DrawerRouter onLogout={() => handleLoginChange(false)}/> : <StackRouter onLogin={() => handleLoginChange(true)}/> }
    </NavigationContainer>
  );
}
