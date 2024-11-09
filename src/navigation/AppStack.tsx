import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import Map from '../pages/map';
import Register from '../pages/Register';

const Drawer = createDrawerNavigator();

export default function AppStack() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{headerShown: false}}>
      <Drawer.Screen name="Mapa" component={Map} />
      <Drawer.Screen name="Register" component={Register} />
    </Drawer.Navigator>
  );
}
