import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
  ViewStyle,
} from 'react-native';
import _ from 'lodash';

import * as theme from '../theme';
import Icon, { IconName } from './Icon';

interface Props {
  data: readonly any[];
  renderItem: ListRenderItem<any> | null | undefined;
}

export default function HorizontalFlatList({ data, renderItem }: Props): JSX.Element {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [viewableItemCount, setViewableItemCount] = useState(0);

  const handleArrowScroll = (isRight: boolean): void => {
    const newIndex = index + (isRight ? viewableItemCount : -viewableItemCount);
    flatListRef?.current?.scrollToIndex({ index: newIndex });
    setIndex(newIndex);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const itemWidth = event.nativeEvent.contentSize.width / data.length;
    const index = _.floor(event.nativeEvent.contentOffset.x / itemWidth);
    setIndex(index);
  };

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > viewableItemCount) setViewableItemCount(viewableItems.length);
  }, []);

  return (
    <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <View style={[theme.alignCenter, theme.flexRow, theme.relative]}>
        {isHover && index > 0 && (
          <ScrollArrow
            iconName={IconName.CHEVRON_LEFT}
            onPress={() => handleArrowScroll(false)}
            style={[theme.l(0)]}
          />
        )}
        <FlatList
          data={data}
          horizontal
          onScroll={handleScroll}
          onViewableItemsChanged={handleViewableItemsChanged}
          ref={flatListRef}
          renderItem={renderItem}
        />
        {isHover && data && index + viewableItemCount < data.length && (
          <ScrollArrow
            iconName={IconName.CHEVRON_RIGHT}
            onPress={() => handleArrowScroll(true)}
            style={[theme.r(0)]}
          />
        )}
      </View>
    </div>
  );
}

function ScrollArrow({
  iconName,
  onPress,
  style,
}: {
  iconName: IconName;
  onPress: () => void;
  style: ViewStyle[];
}): JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={[
        theme.absolute,
        theme.b(0),
        theme.bg(theme.Color.DARK, 0.5),
        theme.justifyCenter,
        theme.t(0),
        theme.zIndex(1),
        ...style,
      ]}>
      <Icon color={theme.Color.WHITE} name={iconName} size={28} />
    </Pressable>
  );
}
