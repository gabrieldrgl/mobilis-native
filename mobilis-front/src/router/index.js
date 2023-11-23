import { createDrawerNavigator } from "@react-navigation/drawer"
import Map from "../pages/map"
import Profile from "../pages/profile"
import Login from "../pages/login";

const Drawer = createDrawerNavigator();

export default function Router() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Mapa" component={Map}/>
      <Drawer.Screen name="Perfil" component={Profile}/>
      <Drawer.Screen name="Login" component={Login}/>
    </Drawer.Navigator>
  )
}
