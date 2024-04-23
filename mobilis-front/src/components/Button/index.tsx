import { Container, Title } from "./styles";


export default function Button(props) {
  return(
    <Container onPress={props.onPress} >
      <Title>{props.title}</Title>
    </Container>
  )
}
