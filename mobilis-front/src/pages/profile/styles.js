import styled from "styled-components";

export const Container = styled.View`
  display: flex;
  height: 100%;
  width: 100%;
  gap: 40px;
  background-color: #FFFFFF;
`;

export const Header = styled.View`
  background-color: #277DFE;
  border-radius: 0 0 10px 10px;
  width: 100%;
  padding: 50px 0 25px 0;
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const Picture = styled.View`
  background-color: #E9E9E9;
  border-radius: 100%;
  height: 140px;
  width: 140px;
`;

export const Name = styled.Text`
  color: #FFFFFF;
  font-size: 32px;
`;

export const Informations = styled.View`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  padding-bottom: 40px;
`;

export const Card = styled.View`
  background-color: #E9E9E9;
  border-radius: 10px;
  padding: 20px 15px;
  width: 300px;
`;

export const CardText = styled.Text`
  color: #000000;
  font-size: 22px;
`;
