import React, { useState } from "react";
import { Container, ImageContainer, LoginForm, Label } from "./styles";
import { View, KeyboardAvoidingView } from "react-native";

import { Input } from "../../components/Input"

const image = "../../assets/van.png";

interface user {
  login: string;
  password: string;
}

const users: user[] = [{ login: "caio", password: "123" }];

export default function Login() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  function validateUser() {
    if (login == users[0].login && password == users[0].password) {
      alert("Entrou no sistema!")
    }
  }

  return (
    <View>
      <Container>
      <ImageContainer source={require(image)}/>
      </Container>
      {/* Ao acessar input para digitar tá subindo o body do form */}
      <LoginForm>
        <KeyboardAvoidingView>
          <Label>Usuario / E-mail</Label>
          <Input name={'mail'} size={24} color={'#277DFE'} placeholder="Digite seu e-mail" />
          <Label>Senha</Label>
          <Input name={'lock'} size={24} color={'#277DFE'} placeholder="Digite sua senha" secureTextEntry={true} />
        </KeyboardAvoidingView>
      </LoginForm>
    </View>
  );
}
