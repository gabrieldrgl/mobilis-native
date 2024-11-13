import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, TextInput, Alert } from "react-native";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isDriversLoading, setIsDriversLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [studentMenuVisible, setStudentMenuVisible] = useState(null);
  const [newStudentMenus, setNewStudentMenus] = useState([]); // Para armazenar novos menus de alunos

  useEffect(() => {
    const fetchVanDetails = async () => {
      if (mode == "edit") {
        try {
          const response = await axios.get(`${BASE_URL}/companies/${userInfo.company_id}/vans/${vanId}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          setVanDetails(response.data.van);
          setSelectedDriver(response.data.driver);
          setLicensePlate(response.data.van.license_plate); // Define o valor inicial da placa

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

  const saveVanDetails = async () => {
    try {
      const selectedStudentIds = newStudentMenus.map(student => student.id);

      const response = mode === "edit"
        ? await axios.put(`${BASE_URL}/companies/${userInfo.company_id}/vans/${vanId}`, {
            van: {
              driver_id: selectedDriver?.id,
              student_ids: selectedStudentIds,
              license_plate: licensePlate,
            }
          }, {
            headers: { Authorization: `Bearer ${userToken}` },
          })
        : await axios.post(`${BASE_URL}/companies/${userInfo.company_id}/vans/`, {
            van: {
              driver_id: selectedDriver?.id,
              student_ids: selectedStudentIds,
              license_plate: licensePlate,
            }
          }, {
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
  );
}
