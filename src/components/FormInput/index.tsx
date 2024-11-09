import { InputContainer } from "./styles";
import { Label } from "./styles";
import { Container } from "./styles";

export default function FormInput({label, placeholder, value, onChangeText}) {
  return (
    <Container>
      <Label>{label}</Label>
      <InputContainer placeholder={placeholder} value={value} onChangeText={onChangeText} />
    </Container>
  );
}
