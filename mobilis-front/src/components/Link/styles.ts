import styled from "styled-components/native";

import { colors } from "../../global/theme";

export const Container = styled.TouchableOpacity`
  height: 20px;
  margin-top: 11px;
`;

export const Title = styled.Text`
  background-color: red;
  color: ${colors.primary};
  font-size: 16px;
`;

