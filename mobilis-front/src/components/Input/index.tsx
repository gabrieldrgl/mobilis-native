import React from "react";
import { Container, InputText, Icon } from "./style";
import { OpaqueColorValue, TouchableOpacity } from "react-native";

interface IInput {
    automationId: string
}

export function Input(props) {
    return (
        <Container>
            <Icon name={props.name} size={props.size} color={props.color} />
            <InputText placeholder={props.placeholder} secureTextEntry={props.secureTextEntry} value={props.value} onChangeText={props.onChangeText} />
        </Container>
    )
}
