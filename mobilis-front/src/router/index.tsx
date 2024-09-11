import { createDrawerNavigator } from "@react-navigation/drawer"
import { createStackNavigator } from "@react-navigation/stack";
import { Map }  from "../pages/map/index"
import Login from "../pages/Login";
import { Register } from "../pages/Register";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

interface Props {
  onLogout?: () => void;
  onLogin?: () => void
}

export function DrawerRouter({ onLogout }: Props) {
  return (
      <Drawer.Navigator>
        <Drawer.Screen name="Map" component={Map}/>
      </Drawer.Navigator>
  )
}

export function StackRouter({ onLogin }: Props) {
  return (
    <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} initialParams={{ onLogin }}/>
    <Stack.Screen name="Register" component={Register}/>
    <Stack.Screen name="Map" component={Map} />
  </Stack.Navigator>
  )
}
