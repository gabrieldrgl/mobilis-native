import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RoundedContainer from "../../components/roundedContainer";
import {
  Background,
  Button,
  ButtonText,
  FormContainer,
  IconContainer,
  RoundedFooter,
  VanIcon,
} from "./styles";
import FormInput from "../../components/FormInput";
import { BASE_URL } from "../../config";

export default function Register() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    const { email, password, confirmPassword } = formData;

    // Validação básica
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      // Requisição para a API
      const response = await fetch(`${BASE_URL}/users/tokens/sign_up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Verifica a resposta da API
      if (response.ok) {
        Alert.alert("Sucesso", "Usuário registrado com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"), // Navega para a tela de login
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.message || "Erro ao registrar usuário.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registrar o usuário.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Background>
          <IconContainer>
            <VanIcon source={require("../../../assets/vanicon.png")} />
          </IconContainer>

          <FormContainer>
            <RoundedFooter>
              <FormInput
                label="E-mail"
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
              />
              <FormInput
                label="Senha"
                placeholder="Digite sua senha"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
              />
              <FormInput
                label="Confirmar senha"
                placeholder="Digite sua senha"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
              />

              <Button onPress={handleRegister}>
                <ButtonText>Cadastrar</ButtonText>
              </Button>
            </RoundedFooter>
          </FormContainer>
        </Background>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
