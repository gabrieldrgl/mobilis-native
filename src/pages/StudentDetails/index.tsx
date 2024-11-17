// StudentDetails.js
import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Modal, Button, StyleSheet } from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config";

export default function StudentDetails({ studentId, visible, onClose }) {
  const { userToken } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchStudentDetails();
    }
  }, [visible]);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${studentId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setStudent(response.data.user);
    } catch (error) {
      console.log("Erro ao buscar detalhes do aluno:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.title}>Detalhes do Aluno</Text>
              <Text>Nome: {student.name}</Text>
              <Button title="Fechar" onPress={onClose} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
