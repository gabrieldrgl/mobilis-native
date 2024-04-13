import { Container, InputText } from "./style";


export function Input(props) {
    return (
        <Container>
            <InputText placeholder={props.placeholder} />
        </Container>
    )
}
