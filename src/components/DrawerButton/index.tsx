import { useNavigation } from "@react-navigation/native";
import { Bar, Container } from "./styles";


export default function DrawerButton() {
  const navigation = useNavigation();

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <Container onPress={handleOpenDrawer}>
      <Bar />
      <Bar />
      <Bar />
    </Container>
  );
}
