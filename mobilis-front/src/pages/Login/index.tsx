import React, { useState } from "react";
import { Container, ImageContainer, LoginForm, Label, Line } from './styles';
import { View, KeyboardAvoidingView, Alert } from "react-native";
import { Input } from "../../components/Input"
import Button from "../../components/Button";
import { colors } from "../../global/theme";
import Link from "../../components/Link";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import User from "../../models/user";
import { useAuth } from "../../contexts/AuthContext";

type RootStackParamList = {
  Map: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const image = "../../assets/van.png";

// TODO - Trocar para a requisição do endpoint de user da api!!
const users: User[] = [
  { id: "1", name: "caio", password: "1234", role: "driver", email: "caio@gmail.com", location: { latitude: 0, longitude: 0 } },
  { id: "2", name: "joao", password: "123", role: "student", email: "joao@gmail.com", location: { latitude: 0, longitude: 0 } }
]

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    const user = users.find(u => u.name === login && u.password === password);

    if (user) {
      try {
        await signIn(user);
        navigation.navigate('Map');
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        Alert.alert("Erro", "Ocorreu um erro ao fazer login");
      }
    } else {
      Alert.alert("Erro", "E-mail ou senha incorretos");
    }
  };

  return (
    <View>
      <Container>
        <ImageContainer source={require(image)} />
      </Container>
      <KeyboardAvoidingView>
        <LoginForm>
          <Label>Usuário / E-mail</Label>
          <Input
            name={'mail'}
            color={colors.primary}
            placeholder="Digite seu e-mail"
            value={login}
            onChangeText={setLogin} />
          <Label>Senha</Label>
          <Input name={'lock'}
            size={24}
            color={'#277DFE'}
            placeholder="Digite sua senha"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            iconLeft={'eye'}
            onPress={() => { }} />
          <View>
            <Link
              onPress={() => { }}
              title="Esqueceu sua senha?" />
            <Link
              onPress={() => { }}
              title="Sou uma empresa!" />
          </View>
          <Line />
          <Button
            title="Entrar com o Google"
            onPress={() => { }} />
          <Button
            onPress={handleLogin}
            title={"Entrar"} />
        </LoginForm>
      </KeyboardAvoidingView>
    </View>
  );
}