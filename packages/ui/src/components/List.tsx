import React from 'react';
import { Pressable, ScrollView, ViewStyle } from 'react-native';
import useTheme from '../hooks/useTheme';

interface Props {
  items: Array<{ key: string; onPress: () => void; ui: JSX.Element }>;
  style?: ViewStyle[];
}

export default function List({ items, style = [] }: Props): JSX.Element {
  const theme = useTheme();

  return (
    <ScrollView style={[theme.flex1, ...style]}>
      {items.map((item) => (
        <Pressable key={item.key} onPress={item.onPress} style={[theme.bb(), theme.pv(3)]}>
          {item.ui}
        </Pressable>
      ))}
    </ScrollView>
  );
}
