import MapView from 'react-native-maps';
import RoundedContainer from '../../components/roundedContainer';
import { Button, ButtonText, CheckinText } from './styles';

export default function Map() {
  return (
    <>
      <MapView
        style={{width: "100%", height: "100%"}}
        initialRegion={{
          latitude: 37.788225,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      />

      <RoundedContainer>
        <CheckinText>Horário máximo para check-in: 17:30</CheckinText>
        <Button>
          <ButtonText>Realizar check-in</ButtonText>
        </Button>
      </RoundedContainer>
    </>
  );
}
