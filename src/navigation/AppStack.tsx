import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import Map from '../pages/map';
import VanStack from './VanStack';
import Students from '../pages/Students';
import Drivers from '../pages/Drivers';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

export default function AppStack() {
  const { userInfo } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Mapa" component={Map} />

      {userInfo.role === "moderator" && (
        <>
          <Drawer.Screen name="Vans" component={VanStack} />
          <Drawer.Screen name="Alunos" component={Students} />
          <Drawer.Screen name="Motoristas" component={Drivers} />
        </>
      )}
    </Drawer.Navigator>
  );
}
