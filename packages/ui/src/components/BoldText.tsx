import { View } from "react-native";
import styled from "../styled";

export const BoldText = styled<{
  pr?: boolean;
  pl?: boolean;
}>(View, {
  styles: {
    fontWeight: '600',
    fontSize: 14,
  },
  computeStyles({pr, pl}) {
    return {
      paddingRight: pr ? '3px' : '0px',
      paddingLeft: pl ? '3px' : '0px'
    } 
  },
});