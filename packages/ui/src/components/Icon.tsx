import React, { createElement, Pressable, View, ViewStyle } from 'react-native';
import { AntDesign, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import * as theme from '../theme';

interface Props {
  color?: theme.Color;
  name: IconName;
  onPress?: () => void;
  size?: number;
  style?: ViewStyle[];
}

export default function Icon({ color, name, onPress, size, style }: Props): JSX.Element {
  const icon = createElement(nameToComponent[name], {
    ...nameToProps[name],
    color,
    title: 'Logout',
    size: size ?? nameToProps[name].size,
  });

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={style}>
        {icon}
      </Pressable>
    );
  }

  return <View style={style}>{icon}</View>;
}

export enum IconName {
  CHEVRON_LEFT,
  CHEVRON_RIGHT,
  CLOSE,
  CREATE,
  INFO,
  LIBRARY,
  LIST,
  LOCK,
  LOGOUT,
  MENU,
  PROFILE,
  SEARCH,
  STORE,
}

const nameToComponent = {
  [IconName.CHEVRON_LEFT]: MaterialIcons,
  [IconName.CHEVRON_RIGHT]: MaterialIcons,
  [IconName.CLOSE]: MaterialIcons,
  [IconName.CREATE]: MaterialCommunityIcons,
  [IconName.INFO]: MaterialIcons,
  [IconName.LIBRARY]: MaterialCommunityIcons,
  [IconName.LIST]: MaterialIcons,
  [IconName.LOCK]: MaterialCommunityIcons,
  [IconName.LOGOUT]: AntDesign,
  [IconName.MENU]: MaterialIcons,
  [IconName.PROFILE]: MaterialCommunityIcons,
  [IconName.SEARCH]: MaterialIcons,
  [IconName.STORE]: FontAwesome5,
};

const nameToProps = {
  [IconName.CHEVRON_LEFT]: { name: 'chevron-left', size: 20 },
  [IconName.CHEVRON_RIGHT]: { name: 'chevron-right', size: 20 },
  [IconName.CLOSE]: { name: 'close', size: 20 },
  [IconName.CREATE]: { name: 'pencil', size: 16 },
  [IconName.INFO]: { name: 'info-outline', size: 16 },
  [IconName.LIBRARY]: { name: 'bookshelf', size: 16 },
  [IconName.LIST]: { name: 'format-list-numbered', size: 16 },
  [IconName.LOCK]: { name: 'lock', size: 16 },
  [IconName.LOGOUT]: { name: 'logout', size: 16 },
  [IconName.MENU]: { name: 'menu', size: 16 },
  [IconName.PROFILE]: { name: 'account', size: 16 },
  [IconName.SEARCH]: { name: 'search', size: 20 },
  [IconName.STORE]: { name: 'store', size: 16 },
};
