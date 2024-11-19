import React, { useContext, useState } from 'react';
import MapView from 'react-native-maps';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import RoundedContainer from '../../components/roundedContainer';
import { Button, ButtonText, CheckinText } from './styles';
import DrawerButton from '../../components/DrawerButton';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';

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
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: 37.788225,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={{
          latitude: formData.latitude || 37.788225,
          longitude: formData.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      <RoundedContainer>
        {userInfo.van_id ? (
          <>
            {(() => {
              // Determinar o horário com base na rota
              const checkinTime = vanInfo.first_route_of_day
                ? vanInfo.max_checkin_time_away
                : vanInfo.max_checkin_time_return;

                const handleCheckin = async () => {
                  if (checkinDone) return; // Evita múltiplos check-ins

                  try {
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