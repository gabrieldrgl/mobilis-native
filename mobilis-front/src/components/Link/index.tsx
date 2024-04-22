import { Container, Title } from './styles'

export default function Link(props) {
  return(
    <Container onPress={props.onPress}>
			<Title>{props.title}</Title>
    </Container>
  )
}
