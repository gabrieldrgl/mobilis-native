import styled from "styled-components";

export const Background = styled.View`
  background-color: #277DFE;
  height: 100%;
  width: 100%;
`;

export const IconContainer = styled.SafeAreaView`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const VanIcon = styled.Image`
  height: 170px;
  width: 170px;
`;

export const FormContainer = styled.View`
  flex: 2;
`;

export const RoundedFooter = styled.View`
  background-color: #F3F3F3;
  border-radius: 20px 20px 0 0;
  width: 100%;
  padding: 20px 30px 45px 30px;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 15px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #277DFE;
  padding: 10px;
  align-items: center;
  border-radius: 4px;
  width: 220px;
  margin: 60px 0;
`;

export const ButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 24px;
`;

export const Hr = styled.View`
  height: 2px;
  width: 100%;
  background-color: #277DFE;
`;

export const RegisterText = styled.Text`
  color: #000000;
  font-size: 20px;
  margin: 50px 0;
`;

export const RegisterLink = styled.Text`
  color: #0057FF;
`;
