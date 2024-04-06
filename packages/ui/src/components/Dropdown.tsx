import React, { useContext, useEffect, useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';

import { OverlayContext } from '../context';
import * as theme from '../theme';

interface Props {
  children: (params: {
    openDropdown: () => void;
    closeDropdown: () => void;
  }) => JSX.Element;
  style?: ViewStyle[];
  trigger: JSX.Element;
}

export default function Dropdown({
  children,
  style = [],
  trigger,
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false) ;
  const { isOpen: overlayIsOpen, setElement, setPosition } = useContext(OverlayContext);
  const [isMounted, setIsMounted] = useState(false);
  const open = () => {
    setIsOpen(true);
    setElement(
      <View
        onLayout={setPosition}
        style={[
          theme.absolute,
          theme.border(theme.Color.GRAY_MEDIUM),
          theme.bg(theme.Color.OFF_WHITE),
          theme.r(0),
          theme.rounded(2),
          theme.zIndex(999999),
          {
            marginTop: '2px'
          }
        ]}
      >
        {children({
          openDropdown: open,
          closeDropdown: close 
        })}
      </View>,
    );
  }
  const close = () => {
    setIsOpen(false);
    setElement(undefined);
  }

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  useEffect(() => {
    if (isMounted) {
      if (!overlayIsOpen) {
        close();
      }
    } else setIsMounted(true);
  }, [overlayIsOpen]);

  return (
    <View style={style}>
      <Pressable onPress={toggle}>
        {trigger}
      </Pressable>
      <View onLayout={setPosition} style={theme.relative}></View>
    </View>
  );
}
