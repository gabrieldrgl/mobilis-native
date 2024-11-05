import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { HeaderContainer, UserIcon, UserName, ListContainer } from "./styles";

export default function CustomDrawer(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: "#277DFE"}}>
      <HeaderContainer>
        <UserIcon source={require("../../../assets/user-icon.png")}/>
        <UserName>Nome do usuário</UserName>
      </HeaderContainer>
      <ListContainer>
        <DrawerItemList {...props}/>
      </ListContainer>
    </DrawerContentScrollView>
  );
}
