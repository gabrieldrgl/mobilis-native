import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { FooterText, Button, ButtonText } from './styles';
import { RoundedFooter } from '../../components/roundedFooter/styles';
import User from '../../models/user';

type Posicao = {
  latitude: number;
  longitude: number;
  descricao: string;
};

const USUARIOS_MOCK: User[] = [{
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: '123456',
  role: 'driver',
  location: { latitude: 0, longitude: 0 }
}];

const ALUNOS_MOCK: Posicao[] = [
  { latitude: -24.946950977119094, longitude: -53.50766888929068, descricao: 'Aluno 1' },
  { latitude: -24.948000, longitude: -53.505000, descricao: 'Aluno 2' },
];

export function Map() {
  const [localizacaoAtual, setLocalizacaoAtual] = useState<Posicao | null>(null);
  const [alunosParaPegar, setAlunosParaPegar] = useState<Posicao[]>([]);
  const [destinoAtual, setDestinoAtual] = useState<Posicao | null>(null);
  const [indiceAlunoAtual, setIndiceAlunoAtual] = useState(0);

  useEffect(() => {
    obterLocalizacaoAtual();
  }, []);

  const obterLocalizacaoAtual = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const novaLocalizacao = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        descricao: 'Localização atual'
      };
      
      setLocalizacaoAtual(novaLocalizacao);
      setAlunosParaPegar(ALUNOS_MOCK);
      setDestinoAtual(ALUNOS_MOCK[0]);
    } catch (erro) {
      console.error('Erro ao obter localização:', erro);
    }
  };

  const atualizarProximoDestino = () => {
    const proximoIndice = indiceAlunoAtual + 1;
    if (proximoIndice < alunosParaPegar.length) {
      setDestinoAtual(alunosParaPegar[proximoIndice]);
      setIndiceAlunoAtual(proximoIndice);
    } else {
      setDestinoAtual(null);
      alert('Todos os alunos foram pegos!');
    }
  };

  if (!localizacaoAtual || !destinoAtual) {
    return <Text>Carregando...</Text>;
  }
 
  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          ...localizacaoAtual,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsBuildings={true}
        showsIndoors={true}
        showsPointsOfInterest={true}
        showsTraffic={true}
      >
        <Marker
          coordinate={localizacaoAtual}
          title="Sua localização"
          description="Você está aqui"
        />
        <Marker
          coordinate={destinoAtual}
          title={`Aluno ${indiceAlunoAtual + 1}`}
          description={destinoAtual.descricao}
        />
        <MapViewDirections
          origin={localizacaoAtual}
          destination={destinoAtual}
          apikey={""}
          strokeWidth={3}
          strokeColor="#d31ad3"
          mode="DRIVING"
          onReady={(result) => {
            console.log(`Distância: ${result.distance} km`)
            console.log(`Duração: ${result.duration} min.`)
          }}
        />
      </MapView>

      <RoundedFooter>
        <FooterText>Horário máximo para check-in - 17:30</FooterText>
        <Button>
          <ButtonText>
            {USUARIOS_MOCK[0].role === 'driver' ? 'Iniciar rota' : 'Realizar check-in'}
          </ButtonText>
        </Button>
      </RoundedFooter>
    </View>
  );
}
