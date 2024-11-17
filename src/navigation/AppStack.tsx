import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import Map from '../pages/map';
import VanStack from './VanStack';
import Students from '../pages/Students';
import Drivers from '../pages/Drivers';

const Drawer = createDrawerNavigator();

export default function AppStack() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{headerShown: false}}>
      <Drawer.Screen name="Mapa" component={Map} />
      <Drawer.Screen name="Vans" component={VanStack} />
      <Drawer.Screen name="Alunos" component={Students} />
      <Drawer.Screen name="Motoristas" component={Drivers} />
    </Drawer.Navigator>
  );
}
