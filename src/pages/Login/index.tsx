import React, { useContext, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Background, Button, ButtonText, FormContainer, Hr, IconContainer, Input, InputContainer, InputLabel, RegisterLink, RegisterText, RoundedFooter, VanIcon } from "./styles";
import FormInput from "../../components/FormInput";
import DropShadow from "react-native-drop-shadow";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const {login} = useContext(AuthContext);

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
            <VanIcon source={require("../../../assets/vanicon.png")}/>
          </IconContainer>

          <FormContainer>
            <RoundedFooter>
              <FormInput label="E-mail" placeholder="Digite seu e-mail" value={email} onChangeText={text => setEmail(text)} />
              <FormInput label="Senha" placeholder="Digite sua senha" value={password} onChangeText={text => setPassword(text)} />

              <Button onPress={() => {login(email, password)}}>
                <ButtonText>
                  Entrar
                </ButtonText>
              </Button>

              <Hr />

              <RegisterText>
                Não possui uma conta? <RegisterLink>Cadastre-se</RegisterLink>
              </RegisterText>
            </RoundedFooter>
          </FormContainer>
        </Background>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
