import { View } from "react-native"
import { Container, Title } from "./styles"

export default function Link(props: { onPress: () => void, title: string }) {
  return (
    <Container onPress={props.onPress}>
      <Title>{props.title}</Title>
    </Container>
  )
}
