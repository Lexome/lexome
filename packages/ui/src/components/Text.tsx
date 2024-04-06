import React from 'react';
import { Text as ReactNativeText, TextStyle } from 'react-native';

import * as theme from '../theme';

export enum TextAlign {
  LEFT,
  CENTER,
  RIGHT,
}



const alignToStyle = {
  [TextAlign.LEFT]: { textAlign: 'left' as const },
  [TextAlign.CENTER]: { textAlign: 'center' as const },
  [TextAlign.RIGHT]: { textAlign: 'right' as const },
};

export enum TextType {
  BUTTON,
  DEFAULT,
  HEADLINE,
  HELPER,
  HEADING,
  LABEL,
  SUBTITLE,
  TITLE,
}

export const typeToTextStyle = {
  [TextType.BUTTON]: { fontFamily: theme.Font.ROBOTO_BOLD, fontSize: 16 },
  [TextType.DEFAULT]: { fontFamily: theme.Font.ROBOTO_REGULAR, fontSize: 16 },
  [TextType.HEADLINE]: { fontFamily: theme.Font.ROBOTO_REGULAR, fontSize: 32 },
  [TextType.HEADING]: { fontFamily: theme.Font.ROBOTO_BOLD, fontSize: 20 },
  [TextType.HELPER]: { fontFamily: theme.Font.ROBOTO_REGULAR, fontSize: 12 },
  [TextType.LABEL]: { fontFamily: theme.Font.ROBOTO_BOLD, fontSize: 15 },
  [TextType.SUBTITLE]: { fontFamily: theme.Font.ROBOTO_BOLD, fontSize: 19 },
  [TextType.TITLE]: { fontFamily: theme.Font.ROBOTO_REGULAR, fontSize: 21 },
};

interface Props {
  align?: TextAlign;
  children: string | string[] | undefined;
  color?: theme.Color;
  numberOfLines?: number;
  onPress?: () => void;
  style?: TextStyle[];
  type?: TextType;
}

export default function Text({
  align = TextAlign.LEFT,
  children,
  color,
  numberOfLines,
  onPress,
  style = [],
  type = TextType.DEFAULT,
}: Props): JSX.Element | null {
  if (!children) {
    return null;
  }

  if (!color) color = onPress ? theme.Color.PRIMARY : theme.Color.DARK;

  return (
    <ReactNativeText
      numberOfLines={numberOfLines}
      onPress={onPress}
      style={[alignToStyle[align], { color }, typeToTextStyle[type], ...style]}>
      {children}
    </ReactNativeText>
  );
}
