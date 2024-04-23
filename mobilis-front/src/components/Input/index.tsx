import React from "react";
import { Container, InputText, Icon } from "./style";
import { colors } from "../../global/theme";

export function Input(props, color = colors.primary, size = 28) {
	return (
		<Container testID={props.testID}>
			<Icon name={props.name}
				size={props.size ?? size}
				color={props.color ?? color} />
			<InputText placeholder={props.placeholder}
				secureTextEntry={props.secureTextEntry}
				value={props.value}
				onChangeText={props.onChangeText} />
		</Container>
	)
}
