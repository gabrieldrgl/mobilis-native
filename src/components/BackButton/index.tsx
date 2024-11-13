import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { StyledButton } from "./styles";

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <StyledButton onPress={() => navigation.goBack()}>
      <Icon name="arrow-back" size={24} color="#FFFFFF" />
    </StyledButton>
  );
}