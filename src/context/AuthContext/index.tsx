import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../../config";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const login = (email, password) => {
    setIsLoading(true);
    axios.post(`${BASE_URL}/users/tokens/sign_in`, {
      email,
      password
    })
    .then(response => {
      setUserToken(response.data.token)
      AsyncStorage.setItem("userToken", response.data.token);

      getUserInfo(response.data.token, response.data.resource_owner.id);
    })
    .catch(error => {
      console.log(`Login error: ${error}`);
    });
  }

  const getUserInfo = (token, id) => {
    axios.get(`${BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho da requisição
      }
    })
    .then(response => {
      console.log("User info:", response.data.user);

      setUserInfo(response.data.user)
      AsyncStorage.setItem("userInfo", JSON.stringify(response.data.user));

      setIsLoading(false);
    })
    .catch(error => {
      console.log(`User info retrieval error: ${error}`);
    });
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);

    AsyncStorage.removeItem("userInfo");
    AsyncStorage.removeItem("userToken");

    setIsLoading(false);
  }

  // const isLoggedIn = async() => {
  //   try {
  //     setIsLoading(true);
  //     let userInfo = AsyncStorage.getItem("userInfo");
  //     let userToken = AsyncStorage.getItem("userToken");

  //     setUserInfo(userInfo);
  //     setUserToken(userToken);
  //     setIsLoading(false);
  //   } catch(e) {
  //     console.log(`isLoggedIn error: ${e}`)
  //   }
  // }

  // useEffect(() => {
  //   isLoggedIn();
  // }, [])

  return (
    <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo}}>
      {children}
    </AuthContext.Provider>
  );
}
