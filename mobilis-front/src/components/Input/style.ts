import styled from "styled-components/native";
import Icons from '@expo/vector-icons/Feather';

export const Container = styled.View`
    flex-direction: row;
    width: 350px;
    height: 61px;
    border-radius: 4px;
    background-color: #878787;
    padding: 5px;
    align-items: center;
    border-width: 1px;
    border-color: #878787;
`;

export const Icon = styled(Icons)`
   
`;

export const InputText = styled.TextInput`
    padding: 3px;
    margin-left: 12px;
`;
