import DropShadow from "react-native-drop-shadow";
import { Container } from "./styles";

export default function RoundedContainer({children}) {
  return (
    <DropShadow
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
      }}
    >
      <Container>
        {children}
      </Container>
    </DropShadow>
  );
}
