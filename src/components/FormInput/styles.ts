import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.Text`
  color: #000000;
  font-size: 18px;
`;

export const InputContainer = styled.TextInput`
  width: 100%;
  background-color: #E1E1E1;
  border: #878787 1px;
  border-radius: 4px;
  padding: 10px;
  font-size: 18px;
`;

export const StyledTouchableOpacity = styled.TouchableOpacity`
  width: 100%;
  background-color: #E1E1E1;
  border: #878787 1px;
  border-radius: 4px;
  padding: 10px;
  font-size: 18px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
