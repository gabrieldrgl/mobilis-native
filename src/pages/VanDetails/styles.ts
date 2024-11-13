import styled from "styled-components";

export const Header = styled.SafeAreaView`
  background-color: #277DFE;
  width: 100%;
`;

export const HeaderContent = styled.View`
  padding: 25px;
  gap: 5px;
`;

export const HeaderText = styled.Text`
  color: #FFFFFF;
  font-size: 32px;
`;

export const Body = styled.View`
  padding: 25px;
  gap: 15px;
`;

export const Van = styled.TouchableOpacity`
  background-color: #E9E9E9;
  border-radius: 10px;
  padding: 10px;
`;

export const VanText = styled.Text`
  color: #000000;
  font-size: 18px;
`;

export const StyledTouchableOpacity = styled.TouchableOpacity`
  width: 100%;
  background-color: #E1E1E1;
  border: 1px solid #878787;
  border-radius: 4px;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
