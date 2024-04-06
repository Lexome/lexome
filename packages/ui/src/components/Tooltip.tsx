import React from 'react';
import { View, ViewStyle } from 'react-native';

import * as theme from '../theme';

interface Props {
  children: JSX.Element;
  content: JSX.Element;
  isOpen?: boolean;
  style?: ViewStyle[];
}

export default function Tooltip({ children, content, isOpen, style = [] }: Props): JSX.Element {
  return (
    <View style={{ zIndex: 1 }}>
      {children}
      <View style={[theme.relative]}>
        {isOpen && (
          <View
            style={[
              theme.absolute,
              theme.border(),
              theme.bg(theme.Color.WHITE),
              theme.p(3),
              theme.mt(2),
              theme.rounded(2),
              ...style
            ]}>
            {content}
          </View>
        )}
      </View>
    </View>
  );
}
