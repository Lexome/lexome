import React, { useContext } from 'react';
import { Image, ImageStyle, View, ViewStyle } from 'react-native';

import { UserContext } from '../context';
import * as theme from '../theme';
import Icon, { IconName } from './Icon';
import Text from './Text';

interface Props {
  isLarge?: boolean;
  style?: ViewStyle[];
}

export default function Avatar({ isLarge, style = [] }: Props): JSX.Element | null {
  const { profile } = useContext(UserContext);

  if (!profile) return null;

  const size = isLarge ? 48 : 7;

  return (
    <View
      style={[
        theme.alignCenter,
        theme.bg(theme.Color.BLUE_DARK),
        theme.justifyCenter,
        theme.h(size),
        theme.rounded(2),
        theme.w(size),
        ...style,
      ]}>
      {profile.hasProfilePhoto ? (
        <Image
          resizeMode="contain"
          source={{ uri: `https://storage.googleapis.com/lexome_users/${profile.id}/profile.jpeg` }}
          style={[theme.heightFull, theme.rounded(2) as ImageStyle, theme.widthFull]}
        />
      ) : profile.name ? (
        <Text color={theme.Color.WHITE} style={[isLarge ? { fontSize: 100 } : {}]}>
          {profile.name[0]}
        </Text>
      ) : (
        <Icon color={theme.Color.WHITE} name={IconName.PROFILE} size={isLarge ? 100 : 16} />
      )}
    </View>
  );
}
