import { createDrawerNavigator } from "@react-navigation/drawer"
import { Map } from "../pages/map"

const Drawer = createDrawerNavigator();

export default function Router() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Map" component={Map}/>
    </Drawer.Navigator>
  )
}
