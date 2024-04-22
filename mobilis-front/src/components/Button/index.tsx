import { Container, Title } from "./style";


export default function Button(props) {
  return(
    <Container onPress={props.onPress} >
      <Title>{props.title}</Title>
    </Container>
  )
}
