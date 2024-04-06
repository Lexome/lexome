import React, { useContext, useState } from 'react';
import { ActivityIndicator, Pressable, ViewStyle } from 'react-native';

import * as theme from '../theme';
import { FormContext } from './Form';
import Text, { TextAlign, TextType } from './Text';

export enum ButtonType {
  PLAIN,
  PRIMARY,
  SECONDARY,
  WHITE,
}

const typeToButtonStyle = {
  [ButtonType.PLAIN]: [],
  [ButtonType.PRIMARY]: [theme.bg(theme.Color.BLUE_DARK)],
  [ButtonType.SECONDARY]: [theme.border(theme.Color.GRAY_MEDIUM), theme.bg(theme.Color.WHITE)],
  [ButtonType.WHITE]: [theme.bg(theme.Color.WHITE)],
};

const typeToTextColor = {
  [ButtonType.PLAIN]: theme.Color.PRIMARY,
  [ButtonType.PRIMARY]: theme.Color.WHITE,
  [ButtonType.SECONDARY]: theme.Color.DARK,
  [ButtonType.WHITE]: theme.Color.DARK,
};

const typeToTextType = {
  [ButtonType.PLAIN]: TextType.DEFAULT,
  [ButtonType.PRIMARY]: TextType.BUTTON,
  [ButtonType.SECONDARY]: TextType.BUTTON,
  [ButtonType.WHITE]: TextType.BUTTON,
};

interface Props {
  children: string | JSX.Element;
  isSubmit?: boolean;
  onPress?: () => void;
  style?: ViewStyle[];
  type?: ButtonType;
}

export default function Button({
  children,
  isSubmit,
  onPress,
  style = [],
  type = ButtonType.PRIMARY,
}: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onSubmit } = useContext(FormContext);

  const handlePress = async (): Promise<void> => {
    setIsLoading(true);
    if (isSubmit) await onSubmit();
    else if (onPress) await onPress();
    setIsLoading(false);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[theme.ph(4), theme.pv(3), theme.rounded(2), ...typeToButtonStyle[type], ...style]}>
      {isLoading ? (
        <ActivityIndicator color={typeToTextColor[type]} />
      ) : typeof children === 'string' ? (
        <Text align={TextAlign.CENTER} color={typeToTextColor[type]} type={typeToTextType[type]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
