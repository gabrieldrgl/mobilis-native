import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import RoundedContainer from "../../components/roundedContainer";
import { Background, Button, ButtonText, FormContainer, Hr, IconContainer, RegisterLink, RegisterText, RoundedFooter, VanIcon } from "./styles";
import FormInput from "../../components/FormInput";
import DropShadow from "react-native-drop-shadow";

export default function Register() {
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
            <DropShadow
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 1,
                shadowRadius: 5,
              }}
            >
              <RoundedFooter>
                <FormInput label="Nome" placeholder="Digite seu nome" />
                <FormInput label="E-mail" placeholder="Digite seu e-mail" />
                <FormInput label="Senha" placeholder="Digite sua senha" />
                <FormInput label="Confirmar senha" placeholder="Digite sua senha" />

                <Button>
                  <ButtonText>
                    Cadastrar
                  </ButtonText>
                </Button>
              </RoundedFooter>
            </DropShadow>
          </FormContainer>
        </Background>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
