import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import * as theme from '../theme';
import Text from './Text';

interface Props {
  label?: string;
  onChange: (value: boolean) => void;
  style?: ViewStyle[];
  value?: boolean;
}

export default function Checkbox({ label, onChange, style = [], value }: Props): JSX.Element {
  return (
    <Pressable
      onPress={() => onChange?.(!value)}
      style={[theme.alignCenter, theme.flex, theme.flexRow, ...style]}>
      <MaterialIcons
        color={value ? theme.Color.GRAYISH_BLUE : undefined}
        name={value ? 'check-box' : 'check-box-outline-blank'}
        size={20}
      />
      <Text style={[theme.ml(2)]}>{label}</Text>
    </Pressable>
  );
}
