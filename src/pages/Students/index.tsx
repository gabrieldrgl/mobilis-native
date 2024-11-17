import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View, TouchableOpacity, Modal, Text, Clipboard } from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import {
  Body,
  Header,
  HeaderContent,
  HeaderText,
  Student,
  StudentContainer,
  StudentText,
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
import StudentDetails from "../StudentDetails";

export default function Students() {
  const { userInfo, userToken } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [inviteToken, setInviteToken] = useState(null);
  const [isInviteLoading, setIsInviteLoading] = useState(false);

  const openModal = (StudentId) => {
    setSelectedStudentId(StudentId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStudentId(null);
    setInviteToken(null);
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
      setIsLoading(false);
    }
  };

  const confirmRemoveStudent = (studentId) => {
    Alert.alert(
      "Confirmar Remoção",
      "Tem certeza que deseja remover este aluno da empresa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          onPress: () => removeStudent(studentId),
          style: "destructive",
        },
      ]
    );
  };

  const removeStudent = async (studentId) => {
    try {
      await axios.delete(`${BASE_URL}/companies/${userInfo.company_id}/users/${studentId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setStudents(students.filter((student) => student.id !== studentId));
      Alert.alert("Sucesso", "Aluno removido da empresa com sucesso.");
    } catch (error) {
      console.log("Erro ao remover aluno:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar remover o aluno.");
    }
  };

  const generateInvite = async () => {
    setIsInviteLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/invites`,
        { invite: { role: "student" } },
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
      fetchStudents();
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
            <HeaderText>Alunos</HeaderText>
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
        {students.map((student, index) => (
          <StudentContainer key={index}>
            <Student
              onPress={() => openModal(student.id)}
              style={{ flex: 1 }}
            >
              <StudentText>{student.name}</StudentText>
            </Student>
            <DeleteButton onPress={() => confirmRemoveStudent(student.id)}>
              <Icon name="delete" size={18} color="#FFFFFF" />
            </DeleteButton>
          </StudentContainer>
        ))}
      </Body>
      <StudentDetails
        studentId={selectedStudentId}
        visible={isModalVisible && !inviteToken}
        onClose={closeModal}
      />
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
