import React, { useContext, useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import RoundedContainer from '../../components/roundedContainer';
import { Button, ButtonText, CheckinText } from './styles';
import DrawerButton from '../../components/DrawerButton';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import styled from 'styled-components/native';

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
  const { userInfo, userToken, vanInfo } = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(!userInfo.role);
  const [selectedRole, setSelectedRole] = useState(null);
  const [checkinDone, setCheckinDone] = useState(userInfo.checkin || false);
  const [formData, setFormData] = useState({
    name: '',
    inviteToken: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    companyName: '',
    companyCnpj: '',
    latitude: null,
    longitude: null,
  });
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

  console.log(vanInfo)

  const formatCnpj = (value) => {
    // Remove qualquer caractere não numérico
    const onlyNums = value.replace(/\D/g, '');

    // Aplica a máscara do CNPJ
    return onlyNums
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18); // Limita o comprimento máximo
  };

  // Função para buscar os dados do endereço via API
  const fetchAddressData = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data && !response.data.erro) {
        setFormData({
          ...formData,
          street: response.data.logradouro,
          city: response.data.localidade,
        });
      } else {
        Alert.alert('Erro', 'CEP não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      Alert.alert('Erro', 'Não foi possível buscar o endereço.');
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
  };

  const handleFormSubmit = async () => {
    const geoResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formData.street)}%20${formData.number},${formData.city}&key=AIzaSyBuVDyuAvCFMP1lvy7mK18YK1NHlOTEX4c`
    );

    if (geoResponse.data.results.length > 0) {
      const location = geoResponse.data.results[0].geometry.location;
      setFormData({
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
      });
    }

    try {
      let payload = {};

      if (selectedRole === 'student') {
        payload = {
          name: formData.name,
          role: 'student',
          token: formData.inviteToken,
          address: {
            postal_code: formData.cep,
            street: formData.street,
            number: formData.number,
            city: formData.city,
            latitude: geoResponse.data.results[0].geometry.location.lat,
            longitude: geoResponse.data.results[0].geometry.location.lng,
          },
        };
      } else if (selectedRole === 'driver') {
        payload = {
          name: formData.name,
          role: 'driver',
          token: formData.inviteToken,
        };
      } else if (selectedRole === 'moderator') {
        payload = {
          name: formData.name,
          role: 'moderator',
          company: {
            name: formData.companyName,
            cnpj: formData.companyCnpj,
          }
        };
      }

      if(selectedRole === 'moderator') {
        await axios.post(`${BASE_URL}/companies`, payload, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      } else {
        await axios.post(`${BASE_URL}/invites/accept`, payload, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      }

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  return (
    <>
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
          <>
          {console.log(aluno)}
          <Marker
            key={aluno.descricao}
            coordinate={aluno}
            title={aluno.descricao}
            description={`Ponto de coleta`}
          />
          </>
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

      <RoundedContainer>
        {userInfo.van_id ? (
          <>
            {(() => {
              // Determinar o horário com base na rota
              const checkinTime = vanInfo.first_route_of_day
                ? vanInfo.max_checkin_time_away
                : vanInfo.max_checkin_time_return;

                const handleCheckin = async () => {

                  try {

                    if (userInfo.role === "student") {
                      const currentTime = new Date();
                      const [checkinHour, checkinMinute] = vanInfo.first_route_of_day
                        ? vanInfo.max_checkin_time_away.split(":").map(Number)
                        : vanInfo.max_checkin_time_return.split(":").map(Number);

                      const checkinDeadline = new Date();
                      checkinDeadline.setHours(checkinHour, checkinMinute, 0, 0);

                      if (currentTime > checkinDeadline) {
                        Alert.alert("Atenção", "O horário máximo para check-in já passou!", [
                          { text: "OK" },
                        ]);
                        return;
                      }

                      if (currentTime > checkinDeadline) {
                        Alert.alert("Atenção", "O horário máximo para check-in já passou!", [
                          { text: "OK" },
                        ]);
                        return;
                      }
                      // Lógica para estudantes
                      await axios.patch(
                        `${BASE_URL}/users/${userInfo.id}/checkin`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${userToken}`,
                          },
                        }
                      );

                      Alert.alert("Sucesso", "Check-in realizado com sucesso!");
                      setCheckinDone(true); // Atualiza o estado para refletir o check-in
                    } else if (userInfo.role === "driver") {

                      // Lógica para motoristas
                      const response = await axios.post(
                        `${BASE_URL}/companies/${userInfo.company_id}/vans/${vanInfo.id}/routes`,
                        {
                          route: {
                            status: "in_progress",
                            locations_attributes: {
                              latitude: localizacaoAtual.latitude,
                              longitude: localizacaoAtual.longitude
                            }
                          }
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${userToken}`,
                          },
                        }
                      );

                      const students = response.data.students || [];
                      Alert.alert("Sucesso", "Rota criada com sucesso!");
                      setCheckinDone(true); // Atualiza o estado para refletir o check-in
                      setAlunosParaPegar(students); // Define o estado com os alunos retornados
                    }
                  } catch (error) {
                    if (error.response) {
                      Alert.alert(
                        "Erro",
                        error.response.data.errors?.join(", ") || "Erro ao realizar check-in"
                      );
                    } else {
                      Alert.alert("Erro", "Erro ao realizar check-in. Tente novamente.");
                    }
                  }
                };

              return (
                <>
                  <CheckinText>
                    {userInfo.role === "student" ? (
                      `Horário máximo para check-in: ${checkinTime}`
                    ) : (
                      `Horário previsto para saída: ${userInfo}`
                    )}
                  </CheckinText>
                  <Button onPress={handleCheckin}>
                    <ButtonText>{checkinDone ? "Check-in realizado" : "Realizar check-in"}</ButtonText>
                  </Button>
                </>
              );
            })()}
          </>
        ) : (
          <CheckinText>
            Você não está em nenhuma van
          </CheckinText>
        )}
      </RoundedContainer>

      <DrawerButton />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!selectedRole ? (
              <>
                <Text style={styles.title}>Selecione seu papel:</Text>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleRoleSelection('student')}
                >
                  <Text>Aluno</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleRoleSelection('driver')}
                >
                  <Text>Motorista</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleRoleSelection('moderator')}
                >
                  <Text>Empresa</Text>
                </TouchableOpacity>
              </>
            ) : (
              <ScrollView>
                {selectedRole === 'student' && (
                  <>
                    <Text>Token de Convite:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o token"
                      value={formData.inviteToken}
                      onChangeText={(text) =>
                        setFormData({ ...formData, inviteToken: text })
                      }
                    />
                    <Text>Nome:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o seu nome"
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                    />
                    <Text>CEP:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o CEP"
                      value={formData.cep}
                      onChangeText={(text) => {
                        setFormData({ ...formData, cep: text });
                        if (text.length === 8) {
                          fetchAddressData(text);
                        }
                      }}
                    />
                    <Text>Rua:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite a rua"
                      value={formData.street}
                      onChangeText={(text) =>
                        setFormData({ ...formData, street: text })
                      }
                    />
                    <Text>Número:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o número"
                      value={formData.number}
                      onChangeText={(text) =>
                        setFormData({ ...formData, number: text })
                      }
                    />
                    <Text>Cidade:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite a cidade"
                      value={formData.city}
                      onChangeText={(text) =>
                        setFormData({ ...formData, city: text })
                      }
                    />
                  </>
                )}
                {selectedRole === 'driver' && (
                  <>
                    <Text>Token de Convite:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o token"
                      value={formData.inviteToken}
                      onChangeText={(text) =>
                        setFormData({ ...formData, inviteToken: text })
                      }
                    />
                    <Text>Nome:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o seu nome"
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                    />
                  </>
                )}
                {selectedRole === 'moderator' && (
                  <>
                    <Text>Nome:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o seu nome"
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                    />
                    <Text>CNPJ:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o CNPJ"
                      keyboardType="numeric"
                      value={formData.companyCnpj}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          companyCnpj: formatCnpj(text),
                        })
                      }
                    />
                    <Text>Nome da empresa:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Digite o nome da empresa"
                      value={formData.companyName}
                      onChangeText={(text) =>
                        setFormData({ ...formData, companyName: text })
                      }
                    />
                  </>
                )}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackToRoleSelection}
                  >
                    <Text style={styles.backText}>Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleFormSubmit}
                  >
                    <Text style={styles.submitText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#277DFE',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

function teste() {

  return (
    <Container>


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
