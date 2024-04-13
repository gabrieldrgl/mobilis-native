import React, { useState } from "react";
import { Container, ImageContainer, LoginForm, Label } from "./styles";
import { View } from "react-native";

import { Input } from "../../components/Input"

const image = "../../assets/van.svg";

interface user {
  login: string;
  password: string;
}

const users: user[] = [{ login: "caio", password: "123" }];

export default function Login() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  function validateUser() {
    if(login == users[0].login && password == users[0].password) {
      alert("Entrou no sistema!")
    }
  }

  return (
    <View>
      <Container>{/* Aqui vai o Icone da van */}</Container>
      <LoginForm>
        <Label>Usuario / E-mail</Label>
        <Input placeholder="Usuario" />
        <Label></Label>
        <Input placeholder="Senha" secureTextEntry={true} />
        
      </LoginForm>
    </View>
  );
}
