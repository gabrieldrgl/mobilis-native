import React from "react";
import { Container, InputText, Icon } from "./style";

export function Input(props) {
    return (
        <Container>
            <Icon name={props.name} size={props.size} color={props.color}/>
            <InputText placeholder={props.placeholder} />
        </Container>
    )
}
