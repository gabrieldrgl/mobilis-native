import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config";
import { Body, DeleteButton, Header, HeaderBody, HeaderContent, HeaderText, Van, VanContainer, VanText } from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import BackButton from "../../components/BackButton";

export default function Vans({ navigation }) {
  const { userInfo, userToken } = useContext(AuthContext);
  const [vans, setVans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVans = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/companies/${userInfo.company_id}/vans`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setVans(response.data);
    } catch (error) {
      console.log("Erro ao buscar vans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteVan = (vanId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta van?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => deleteVan(vanId),
          style: "destructive",
        },
      ]
    );
  };

  const deleteVan = async (vanId) => {
    try {
      await axios.delete(`${BASE_URL}/companies/${userInfo.company_id}/vans/${vanId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setVans(vans.filter((van) => van.id !== vanId));
      Alert.alert("Sucesso", "Van excluída com sucesso.");
    } catch (error) {
      console.log("Erro ao excluir van:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar excluir a van.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVans();
    }, [userInfo])
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <Header>
        <HeaderContent>
          <BackButton />
          <HeaderBody>
            <HeaderText>Vans</HeaderText>
            <TouchableOpacity onPress={() => navigation.navigate("VanDetails", { mode: "new" })}>
              <Icon name="add-circle" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </HeaderBody>
        </HeaderContent>
      </Header>
      <Body>
        {vans.map((van, index) => (
          <VanContainer key={index}>
            <Van
              onPress={() => navigation.navigate("VanDetails", { vanId: van.id, mode: "edit" })}
              style={{ flex: 1 }}
            >
              <VanText>Van {van.license_plate}</VanText>
            </Van>
            <DeleteButton onPress={() => confirmDeleteVan(van.id)}>
              <Icon name="delete" size={18} color="#FFFFFF" />
            </DeleteButton>
          </VanContainer>
        ))}
      </Body>
    </>
  );
}
