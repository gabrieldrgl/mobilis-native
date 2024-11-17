import DropShadow from "react-native-drop-shadow";
import { Container } from "./styles";

export default function RoundedContainer({children}) {
  return (
    <Container>
      {children}
    </Container>
  );
}
