import { InputContainer } from "./styles";
import { Label } from "./styles";
import { Container } from "./styles";

export default function FormInput({label, placeholder}) {
  return (
    <Container>
      <Label>{label}</Label>
      <InputContainer placeholder={placeholder}/>
    </Container>
  );
}
