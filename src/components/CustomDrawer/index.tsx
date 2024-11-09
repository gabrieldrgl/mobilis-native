import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { HeaderContainer, UserIcon, UserName, ListContainer, DrawerContainer, LogoutButton, LogoutText } from "./styles";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function CustomDrawer(props) {
  const {logout} = useContext(AuthContext);

  return (
    <DrawerContainer>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: "#277DFE"}}>
        <HeaderContainer>
          <UserIcon source={require("../../../assets/user-icon.png")}/>
          <UserName>Nome do usuário</UserName>
        </HeaderContainer>
        <ListContainer>
          <DrawerItemList {...props}/>
        </ListContainer>
      </DrawerContentScrollView>

      <LogoutButton onPress={()=> {logout()}}>
        <LogoutText>Sair</LogoutText>
      </LogoutButton>
    </DrawerContainer>
  );
}
