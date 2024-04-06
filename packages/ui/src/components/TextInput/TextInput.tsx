import React, { useState } from 'react';
import { TextInput as ReactNativeTextInput, View, ViewStyle } from 'react-native';

import { Screen, useScreen } from '../../hooks';
import * as theme from '../../theme';
import Icon, { IconName } from '../Icon';
import { TextType, typeToTextStyle } from '../Text';

interface Props {
  autoFocus?: boolean;
  disable?: boolean;
  error?: string;
  isFocused?: boolean;
  isSearch?: boolean;
  onChange: (value?: string) => void;
  onFocus?: (isFocused: boolean) => void;
  placeholder?: string;
  style?: ViewStyle[];
  value?: string;
}

export default function TextInput({
  autoFocus,
  disable,
  error,
  isSearch,
  onChange,
  onFocus,
  placeholder,
  style = [],
  value,
}: Props): JSX.Element {
  const screen = useScreen();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocusChange = (isFocused: boolean): void => {
    setIsFocused(isFocused);
    if (onFocus) onFocus(isFocused);
  };

  return (
    <View
      style={[
        theme.alignCenter,
        disable
          ? theme.bg(theme.Color.GRAY_LIGHT)
          : error
          ? theme.bg(theme.Color.DANGER, 0.1)
          : undefined,
        theme.border(
          error ? theme.Color.DANGER : isFocused ? theme.Color.PRIMARY : theme.Color.DARK,
          3
        ),
        theme.flexRow,
        theme.ph(1),
        theme.relative,
        theme.rounded(1),
      ]}>
      {isSearch && <Icon name={IconName.SEARCH} size={24} />}

      <ReactNativeTextInput
        autoFocus={autoFocus}
        editable={!disable}
        onBlur={() => handleFocusChange(false)}
        onChangeText={onChange}
        onFocus={() => handleFocusChange(true)}
        placeholder={placeholder}
        placeholderTextColor={theme.Color.SECONDARY}
        style={[
          typeToTextStyle[TextType.DEFAULT],
          theme.alignCenter,
          theme.flex,
          theme.flexRow,
          theme.h(11),
          // @ts-expect-error
          { outline: 'none' as const },
          theme.ph(2),
          screen === Screen.SM ? {} : theme.w(53),
          ...style,
        ]}
        underlineColorAndroid="transparent"
        value={value}
      />

      {isSearch && <Icon name={IconName.CLOSE} onPress={() => onChange()} size={24} />}
    </View>
  );
}
