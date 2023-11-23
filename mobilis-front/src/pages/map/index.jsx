import React from 'react';
import { Background, Button, ButtonText, Footer, FooterText } from './styles';
import MapView from 'react-native-maps';
import { RoundedFooter } from '../../components/roundedFooter/styles';

export default function Map() {
  return (
    <>
      <Background/>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      <RoundedFooter>
        <FooterText>Horário máximo para check-in - 17:30</FooterText>
        <Button><ButtonText>Realizar check-in</ButtonText></Button>
      </RoundedFooter>
    </>
  );
}
