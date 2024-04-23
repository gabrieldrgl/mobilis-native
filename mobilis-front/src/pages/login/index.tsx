import React, { useState } from "react";
import { Container, ImageContainer, LoginForm, Label, Line } from './styles';
import { View, KeyboardAvoidingView, Alert } from "react-native";
import { Input } from "../../components/Input"
import Button from "../../components/Button";
import { colors } from "../../global/theme";
import Link from "../../components/Link";
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from "@react-navigation/drawer";

type RootStackParamList = {
  Login: { onLogin: () => void };
};

type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type RootDrawerParamList = {
  Map: undefined
};


type MapScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Map'>;
type Props = {
  route: LoginScreenRouteProp;
  navigation: LoginScreenNavigationProp & MapScreenNavigationProp;
};


const image = "../../assets/van.png";

interface user {
  login: string;
  password: string;
}

//TODO - Trocar para a requisição do endpoint de user da api!! 
const users: user[] = [
  { login: "caio", password: "1234" },
  { login: "João", password: "123" }
]

export default function Login({ route, navigation }: Props) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  function handleLogin() {
    for (const user of users) {
      if(!login && !password) {
        Alert.alert("Nenhum usuário encontrado")
        return
      }
      
      if (login && password) {
        route.params?.onLogin()
        navigation.navigate('Map')
        break
      }
    }
  };

  return (
    <View>
      <Container>
        <ImageContainer source={require(image)} />
      </Container>
      {/* Ao acessar input para digitar tá subindo o body do form apenas no ANDROID*/}
      <KeyboardAvoidingView>
        <LoginForm>
          <Label>Usuario / E-mail</Label>
          <Input name={'mail'} color={colors.primary} placeholder="Digite seu e-mail" value={login} onChangeText={setLogin} />
          <Label>Senha</Label>
          <Input name={'lock'} placeholder="Digite sua senha" secureTextEntry={true} value={password} onChangeText={setPassword} />
          <Link onPress={() => { }} title="Esqueceu sua senha?" />
          <Link onPress={() => { }} title="Sou uma empresa!" />
          <Button onPress={handleLogin} title={"Entrar"}></Button>
          <Line />
          <Button title="Entrar com o Google" onPress={() => { }} />

        </LoginForm>
      </KeyboardAvoidingView>
    </View>
  );
}
