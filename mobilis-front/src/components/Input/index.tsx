import React from "react";
import { Container, InputText, Icon, Box } from "./style";
import { TouchableOpacity } from "react-native";

export function Input(props) {
    return (
        <Container testID={props.testID}>
            <Box>
                <Icon name={props.name} size={props.size} color={props.color} />
                <InputText placeholder={props.placeholder} secureTextEntry={props.secureTextEntry} value={props.value} onChangeText={props.onChangeText} />
            </Box>
            <TouchableOpacity onPress={props.onPress}>
                <Icon name={props.iconLeft} size={props.size} color={props.color} />
            </TouchableOpacity>
        </Container>
    )
}
