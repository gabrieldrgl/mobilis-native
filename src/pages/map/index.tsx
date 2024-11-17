import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import styled from 'styled-components/native';
import { Text, Alert } from 'react-native';

type Posicao = {
  latitude: number;
  longitude: number;
  descricao: string;
};

const API_KEY = 'AIzaSyBuVDyuAvCFMP1lvy7mK18YK1NHlOTEX4c';

const ALUNOS_MOCK: Posicao[] = [
  { latitude: -24.94895372660779, longitude: -53.4530257330817, descricao: 'Aluno 1' },
  { latitude: -24.93613800450973, longitude: -53.45217705537791, descricao: 'Aluno 2' },
  { latitude: -24.948132569970355, longitude: -53.456626183001525, descricao: 'Aluno 3'} 
];

export default function Map() {
  const [localizacaoAtual, setLocalizacaoAtual] = useState<Posicao | null>(null);
  const [alunosParaPegar, setAlunosParaPegar] = useState<Posicao[]>(ALUNOS_MOCK);

  useEffect(() => {
    obterLocalizacaoAtual();

    const intervalo = setInterval(() => {
      obterLocalizacaoAtual();
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  const obterLocalizacaoAtual = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização negada', 'Por favor, habilite a permissão de localização.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocalizacaoAtual({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        descricao: 'Localização atual'
      });
    } catch (erro) {
      console.error('Erro ao obter localização:', erro);
      Alert.alert('Erro ao obter localização', 'Não foi possível obter sua localização.');
    }
  };

  const atualizarProximoDestino = () => {
    if (alunosParaPegar.length > 1) {
      setAlunosParaPegar(alunosParaPegar.slice(1));
    } else if (alunosParaPegar.length === 1) {
      setAlunosParaPegar([]);
      Alert.alert('Concluído', 'Todos os alunos foram pegos!');
    }
  };

  if (!localizacaoAtual) {
    return <Text>Carregando localização...</Text>;
  }

  return (
    <Container>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: localizacaoAtual.latitude,
          longitude: localizacaoAtual.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Marcador da localização atual */}
        <Marker
          coordinate={localizacaoAtual}
          title="Sua localização"
          description="Você está aqui"
        />

        {/* Marcadores para cada aluno */}
        {alunosParaPegar.map((aluno) => (
          <Marker
            key={aluno.descricao}
            coordinate={aluno}
            title={aluno.descricao}
            description={`Ponto de coleta`}
          />
        ))}

        {/* Verifique se há pelo menos um aluno para pegar e localizacaoAtual está definida */}
        {localizacaoAtual && alunosParaPegar.length > 0 && (
          <>
            {/* Rota para o próximo aluno (em vermelho) */}
            <MapViewDirections
              origin={{
                latitude: localizacaoAtual.latitude,
                longitude: localizacaoAtual.longitude
              }}
              destination={{
                latitude: alunosParaPegar[0].latitude,
                longitude: alunosParaPegar[0].longitude,
              }}
              apikey={API_KEY}
              strokeWidth={3}
              strokeColor="red"
              mode="DRIVING"
              onReady={(result) => {
                console.log(`Rota atual:`);
                console.log(`- Distância: ${result.distance} km`);
                console.log(`- Duração: ${result.duration} min.`);
              }}
              onError={(error) => {
                console.error('Erro ao gerar rota:', error);
                Alert.alert('Erro ao gerar rota', 'Não foi possível calcular a rota.');
              }}
            />

            {/* Rota para os demais alunos (em azul claro) */}
            {alunosParaPegar.length > 1 && (
              <MapViewDirections
                origin={{
                  latitude: alunosParaPegar[0].latitude,
                  longitude: alunosParaPegar[0].longitude
                }}
                waypoints={alunosParaPegar.slice(1, -1).map(aluno => ({
                  latitude: aluno.latitude,
                  longitude: aluno.longitude,
                }))}
                destination={{
                  latitude: alunosParaPegar[alunosParaPegar.length - 1].latitude,
                  longitude: alunosParaPegar[alunosParaPegar.length - 1].longitude,
                }}
                apikey={API_KEY}
                strokeWidth={3}
                strokeColor="lightblue"
                mode="DRIVING"
                onReady={(result) => {
                  console.log(`Rota seguinte:`);
                  console.log(`- Distância: ${result.distance} km`);
                  console.log(`- Duração: ${result.duration} min.`);
                }}
                onError={(error) => {
                  console.error('Erro ao gerar rota:', error);
                  Alert.alert('Erro ao gerar rota', 'Não foi possível calcular a rota.');
                }}
              />
            )}
          </>
        )}
      </MapView>

      {/* Botão para avançar a rota */}
      <Botao onPress={atualizarProximoDestino}>
        <BotaoTexto>
          {alunosParaPegar.length > 0
            ? `Confirmar Aluno ${ALUNOS_MOCK.length - alunosParaPegar.length + 1}`
            : 'Todos os alunos confirmados'}
        </BotaoTexto>
      </Botao>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const Botao = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  align-self: center;
  background-color: #277DFE;
  border-radius: 10px;
  padding: 15px 30px;
`;

const BotaoTexto = styled.Text`
  color: #FFFFFF;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;
