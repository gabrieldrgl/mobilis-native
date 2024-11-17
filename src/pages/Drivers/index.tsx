import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View, TouchableOpacity, Modal, Text, Clipboard } from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import {
  Body,
  Header,
  HeaderContent,
  HeaderText,
  Driver,
  DriverContainer,
  DriverText,
  DeleteButton,
  AddButton,
  AddButtonText,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  TokenText,
  CopyButton,
  CopyButtonText,
  CloseButton,
  CloseButtonText,
  HeaderBody,
} from "./styles";

export default function Drivers() {
  const { userInfo, userToken } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [inviteToken, setInviteToken] = useState(null);
  const [isInviteLoading, setIsInviteLoading] = useState(false);

  const openModal = (driverId) => {
    setSelectedDriverId(driverId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDriverId(null);
    setInviteToken(null);
  };

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
      setIsLoading(false);
    }
  };

  const confirmRemoveDriver = (driverId) => {
    Alert.alert(
      "Confirmar Remoção",
      "Tem certeza que deseja remover este motorista da empresa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          onPress: () => removeDriver(driverId),
          style: "destructive",
        },
      ]
    );
  };

  const removeDriver = async (driverId) => {
    try {
      await axios.delete(`${BASE_URL}/companies/${userInfo.company_id}/users/${driverId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setDrivers(drivers.filter((driver) => driver.id !== driverId));
      Alert.alert("Sucesso", "Motorista removido da empresa com sucesso.");
    } catch (error) {
      console.log("Erro ao remover motorista:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar remover o motorista.");
    }
  };

  const generateInvite = async () => {
    setIsInviteLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/invites`,
        { invite: { role: "driver" } },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setInviteToken(response.data.token);
      setModalVisible(true);
    } catch (error) {
      console.error("Erro ao gerar convite:", error);
      Alert.alert("Erro", "Não foi possível gerar o convite. Tente novamente.");
    } finally {
      setIsInviteLoading(false);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(inviteToken);
    Alert.alert("Copiado", "O código foi copiado para a área de transferência.");
  };

  useFocusEffect(
    useCallback(() => {
      fetchDrivers();
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
            <HeaderText>Motoristas</HeaderText>
            <TouchableOpacity onPress={generateInvite} disabled={isInviteLoading}>
              {isInviteLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="add-circle" size={28} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </HeaderBody>
        </HeaderContent>
      </Header>
      <Body>
        {drivers.map((driver, index) => (
          <DriverContainer key={index}>
            <Driver
              style={{ flex: 1 }}
            >
              <DriverText>{driver.name}</DriverText>
            </Driver>
            <DeleteButton onPress={() => confirmRemoveDriver(driver.id)}>
              <Icon name="delete" size={18} color="#FFFFFF" />
            </DeleteButton>
          </DriverContainer>
        ))}
      </Body>
      {inviteToken && (
        <Modal transparent={true} visible={isModalVisible}>
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>Código de Convite</ModalTitle>
              <TokenText>{inviteToken}</TokenText>
              <CopyButton onPress={copyToClipboard}>
                <CopyButtonText>Copiar</CopyButtonText>
              </CopyButton>
              <CloseButton onPress={closeModal}>
                <CloseButtonText>Fechar</CloseButtonText>
              </CloseButton>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      )}
    </>
  );
}
