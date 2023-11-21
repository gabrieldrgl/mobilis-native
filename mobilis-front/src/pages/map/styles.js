import styled from 'styled-components';

export const Background = styled.View`
  background-color: #277DFE;
  height: 100%;
  width: 100%;
`;

export const Footer = styled.View`
  background-color: #F3F3F3;
  border-radius: 20px 20px 0 0;
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 30px;
  display: flex;
  align-items: center;
`;

export const FooterText = styled.Text`
  font-size: 20px;
  color: #000000;
`;

export const Button = styled.TouchableOpacity`
  background-color: #277DFE;
  border-radius: 10px;
  padding: 15px 0;
  width: 80%;
  margin: 15px 0;
`;

export const ButtonText = styled.Text`
  text-align: center;
  color: #FFFFFF;
  font-size: 22px;
`;
