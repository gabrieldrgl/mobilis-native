import React, { useState } from "react";
import { Container, ImageContainer, LoginForm, Label } from './styles';
import { View, KeyboardAvoidingView, Alert } from "react-native";

import { Input } from "../../components/Input"

const image = "../../assets/van.png";

interface user {
  login: string;
  password: string;
}

const users: user[] = [{ login: "caio", password: "123" }, { login: "João", password: "123" }];

export default function Login() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  function validateUser() {
    if (login && password) {
      for (const user of users) {
        if (user.login == login && user.password == password) {
          Alert.alert("Entrou no sistema!")
          break
        } else {
          Alert.alert('Não deu certo!!')
        }
      }
    }
  }

  return (
    <View>
      <Container>
        <ImageContainer source={require(image)} />
      </Container>
      {/* Ao acessar input para digitar tá subindo o body do form */}
      <LoginForm>
          <Label>Usuario / E-mail</Label>
          <Input name={'mail'} size={24} color={'#277DFE'} placeholder="Digite seu e-mail" value={login} onChangeText={setLogin} />
          <Label>Senha</Label>
          <Input name={'lock'} size={24} color={'#277DFE'} placeholder="Digite sua senha" secureTextEntry={true} value={password} onChangeText={setPassword} />
      </LoginForm>
    </View>
  );
}
