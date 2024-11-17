import styled from "styled-components";

export const Header = styled.SafeAreaView`
  background-color: #277DFE;
  width: 100%;
`;

export const HeaderContent = styled.View`
  padding: 25px;
  gap: 5px;
`;

export const HeaderBody = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderText = styled.Text`
  color: #FFFFFF;
  font-size: 32px;
`;

export const Body = styled.View`
  padding: 25px;
  gap: 15px;
`;

export const StudentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const Student = styled.TouchableOpacity`
  background-color: #E9E9E9;
  border-radius: 10px;
  padding: 10px;
`;

export const StudentText = styled.Text`
  color: #000000;
  font-size: 18px;
`;

export const DeleteButton = styled.TouchableOpacity`
  background-color: #FF0000;
  border-radius: 10px;
  padding: 10px
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #277DFE;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 15px;
`;

export const AddButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: 80%;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 10px;
  align-items: center;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TokenText = styled.Text`
  font-size: 18px;
  color: #333;
  margin-vertical: 10px;
`;

export const CopyButton = styled.TouchableOpacity`
  background-color: #277DFE;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

export const CopyButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
`;

export const CloseButton = styled.TouchableOpacity`
  background-color: #E53935;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

export const CloseButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
`;
