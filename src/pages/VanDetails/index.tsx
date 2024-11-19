import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, TextInput, Alert, ScrollView } from "react-native";
import axios from "axios";
import { BASE_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { Body, Header, HeaderContent, HeaderText, StyledTouchableOpacity } from "./styles";
import { Provider as PaperProvider, Menu } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../components/BackButton";

export default function VanDetails({ route }) {
  const { vanId, mode } = route.params;
  const { userInfo, userToken } = useContext(AuthContext);
  const navigation = useNavigation();

  const [vanDetails, setVanDetails] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]); // Estado para armazenar os alunos selecionados
  const [licensePlate, setLicensePlate] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [maxCheckinIda, setMaxCheckinIda] = useState("");
  const [maxCheckinVolta, setMaxCheckinVolta] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDriversLoading, setIsDriversLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [studentMenuVisible, setStudentMenuVisible] = useState(null);
  const [newStudentMenus, setNewStudentMenus] = useState([]); // Para armazenar novos menus de alunos

  const handleTimeInput = (text, setter) => {
    // Remove caracteres não numéricos
    const sanitizedText = text.replace(/[^0-9]/g, "");

    // Formata o texto como HH:MM
    let formattedText = sanitizedText;

    if (sanitizedText.length >= 3) {
      formattedText = `${sanitizedText.slice(0, 2)}:${sanitizedText.slice(2, 4)}`;
    } else if (sanitizedText.length >= 1) {
      formattedText = sanitizedText;
    }

    // Limita a entrada a 5 caracteres no total (HH:MM)
    setter(formattedText.slice(0, 5));
  };

  useEffect(() => {
    const fetchVanDetails = async () => {
      if (mode == "edit") {
        try {
          const response = await axios.get(`${BASE_URL}/companies/${userInfo.company_id}/vans/${vanId}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          const van = response.data.van;
          console.log(JSON.stringify(response.data.destination))
          setVanDetails(van);
          setSelectedDriver(response.data.driver);
          setLicensePlate(van.license_plate);
          setCep(response.data.destination.postal_code || "");
          setStreet(response.data.destination.street || "");
          setNumber(response.data.destination.number || "");
          setCity(response.data.destination.city || "");
          setMaxCheckinIda(van.max_checkin_time_away || "");
          setMaxCheckinVolta(van.max_checkin_time_return || "");
          setNewStudentMenus(response.data.students || []);

          response.data.students.forEach((student) => {
            // Adiciona os alunos já selecionados aos novos menus
            setNewStudentMenus((prev) => [...prev, student]);
          });
        } catch (error) {
          console.log("Erro ao buscar van:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/companies/${userInfo.company_id}/drivers`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setDrivers(response.data);
      } catch (error) {
        console.log("Erro ao buscar motoristas:", error);
      } finally {
        setIsDriversLoading(false);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/companies/${userInfo.company_id}/students`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setStudents(response.data);
      } catch (error) {
        console.log("Erro ao buscar alunos:", error);
      } finally {
        setIsStudentsLoading(false);
      }
    };

    fetchVanDetails();
    fetchDrivers();
    fetchStudents();
  }, [vanId]);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const openStudentMenu = (index) => setStudentMenuVisible(index);
  const closeStudentMenu = () => setStudentMenuVisible(null);

  const addNewStudentField = () => {
    setNewStudentMenus((prev) => [...prev, {}]); // Adiciona um novo campo para seleção de aluno
  };

  const handleStudentSelection = (student, index) => {
    const updatedStudents = [...newStudentMenus];
    updatedStudents[index] = student;
    setNewStudentMenus(updatedStudents);
    closeStudentMenu();
  };

  const removeStudent = (index) => {
    setNewStudentMenus((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchAddressByCep = async () => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        setStreet(response.data.logradouro || "");
        setCity(response.data.localidade || "");
      } catch (error) {
        console.log("Erro ao buscar endereço:", error);
        Alert.alert("Erro", "CEP inválido ou não encontrado.");
      }
    }
  };

  const saveVanDetails = async () => {
    try {
      const geoResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(street)}%20${number},${city}&key=AIzaSyBuVDyuAvCFMP1lvy7mK18YK1NHlOTEX4c`
      );

      console.log(geoResponse.data.results[0].geometry.location.lat)

      const selectedStudentIds = newStudentMenus.map(student => student.id);

      const payload = {
        van: {
          driver_id: selectedDriver?.id,
          student_ids: selectedStudentIds,
          license_plate: licensePlate,
          max_checkin_time_away: maxCheckinIda,
          max_checkin_time_return: maxCheckinVolta,
        },
        address: {
          postal_code: cep,
          street,
          number,
          city,
          latitude: geoResponse.data.results[0].geometry.location.lat,
          longitude: geoResponse.data.results[0].geometry.location.lng,
        }
      };

      const response = mode === "edit"
        ? await axios.put(`${BASE_URL}/companies/${userInfo.company_id}/vans/${vanId}`, payload, {
            headers: { Authorization: `Bearer ${userToken}` },
          })
        : await axios.post(`${BASE_URL}/companies/${userInfo.company_id}/vans/`, payload, {
            headers: { Authorization: `Bearer ${userToken}` },
          });

      Alert.alert("Sucesso", "Informações da van salvas com sucesso!");
    } catch (error) {
      console.log("Erro ao salvar van:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar as informações da van.");
    }
  };

  if (isLoading || isDriversLoading || isStudentsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const availableStudents = students.filter(student => !newStudentMenus.some(menu => menu.id === student.id));

  return (
    <ScrollView>
      <PaperProvider>
        <Header>
          <HeaderContent>
            <BackButton />
            <HeaderText>Detalhes da Van</HeaderText>
          </HeaderContent>
        </Header>

        <Body>
          <Text>Placa da Van:</Text>
          <TextInput
            placeholder="Digite a placa da van"
            value={licensePlate}
            onChangeText={setLicensePlate}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 20,
              borderRadius: 5,
            }}
          />

          <Text>CEP:</Text>
          <TextInput
            placeholder="Digite o CEP"
            value={cep}
            onChangeText={(text) => setCep(text.replace(/\D/g, ""))}
            onBlur={fetchAddressByCep}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 20,
              borderRadius: 5,
            }}
          />

          <Text>Rua:</Text>
          <TextInput
            placeholder="Rua"
            value={street}
            onChangeText={setStreet}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 20,
              borderRadius: 5,
            }}
          />

          <Text>Número:</Text>
          <TextInput
            placeholder="Número"
            value={number}
            onChangeText={setNumber}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 20,
              borderRadius: 5,
            }}
          />

          <Text>Cidade:</Text>
          <TextInput
            placeholder="Cidade"
            value={city}
            onChangeText={setCity}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 20,
              borderRadius: 5,
            }}
          />

          <Text>Horário Máximo de Check-in (Ida):</Text>
          <TextInput
            placeholder="HH:MM"
            value={maxCheckinIda}
            onChangeText={(text) => handleTimeInput(text, setMaxCheckinIda)}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 20,
              borderRadius: 5,
            }}
          />

          <Text>Horário Máximo de Check-in (Volta):</Text>
          <TextInput
            placeholder="HH:MM"
            value={maxCheckinVolta}
            onChangeText={(text) => handleTimeInput(text, setMaxCheckinVolta)}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 20,
              borderRadius: 5,
            }}
          />

          <Text>Selecione o Motorista:</Text>
          <View>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <StyledTouchableOpacity onPress={openMenu}>
                  <Text style={{ fontSize: 18, color: "#333" }}>{selectedDriver?.name || "Selecionar motorista"}</Text>
                  <Icon name="arrow-drop-down" size={24} color="#878787" />
                </StyledTouchableOpacity>
              }
            >
              {drivers.map((driver) => (
                <Menu.Item
                  key={driver.id}
                  onPress={() => {
                    setSelectedDriver(driver);
                    closeMenu();
                  }}
                  title={driver.name}
                />
              ))}
            </Menu>
          </View>

          <Text>Selecione os Alunos:</Text>
          {newStudentMenus.map((student, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Menu
                visible={studentMenuVisible === index}
                onDismiss={closeStudentMenu}
                anchor={
                  <StyledTouchableOpacity onPress={() => openStudentMenu(index)}>
                    <Text style={{ fontSize: 18, color: "#333" }}>
                      {newStudentMenus[index]?.name || "Selecionar aluno"}
                    </Text>
                    <Icon name="arrow-drop-down" size={24} color="#878787" />
                  </StyledTouchableOpacity>
                }
              >
                {availableStudents.map((student) => (
                  <Menu.Item
                    key={student.id}
                    onPress={() => handleStudentSelection(student, index)}
                    title={student.name}
                  />
                ))}
              </Menu>
              <Icon
                name="delete"
                size={24}
                color="red"
                onPress={() => removeStudent(index)}
                style={{ marginLeft: 10 }}
              />
            </View>
          ))}

          <Button title="Adicionar novo aluno" onPress={addNewStudentField} />

          <Button title="Salvar" onPress={saveVanDetails} color="#4CAF50" />
        </Body>
      </PaperProvider>
    </ScrollView>
  );
}
