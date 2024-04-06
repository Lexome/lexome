import React, { useContext } from 'react';
import { Modal as ReactNativeModal, ScrollView, View, ViewStyle } from 'react-native';

import { Screen, useScreen } from '../hooks';
import * as theme from '../theme';
import Button, { ButtonType } from './Button';
import { FormContext } from './Form';
import Icon, { IconName } from './Icon';
import Text, { TextType } from './Text';

interface Props {
  cancelText?: string;
  children: JSX.Element | JSX.Element[];
  footerElement?: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  style?: ViewStyle[];
  submitText?: string;
  title?: string;
}

export default function Modal({
  cancelText,
  children,
  footerElement,
  isOpen,
  onClose,
  onSubmit,
  style = [],
  submitText,
  title,
}: Props): JSX.Element {
  const form = useContext(FormContext);
  const screen = useScreen();

  const handleSubmit = onSubmit ?? form.onSubmit;

  return (
    <ReactNativeModal transparent visible={isOpen}>
      <View
        style={[
          theme.alignCenter,
          theme.bg(theme.Color.SECONDARY, 2 / 3),
          theme.flex,
          theme.flex1,
          theme.justifyCenter,
        ]}>
        {/* MODAL */}
        <View
          style={[
            theme.bg(theme.Color.WHITE),
            theme.border(),
            theme.ph(screen === Screen.SM ? 4 : 7),
            theme.pv(5),
            theme.rounded(2),
            screen === Screen.SM ? {} : theme.w(title ? 160 : 105),
          ]}>
          {/* HEADER */}
          {title ? (
            <Text type={TextType.HEADING}>{title}</Text>
          ) : (
            <View style={[theme.alignEnd]}>
              <Icon onPress={onClose} name={IconName.CLOSE} />
            </View>
          )}

          {/* BODY */}
          <ScrollView style={[{ maxHeight: 500 }, theme.mt(5), ...style]}>{children}</ScrollView>

          {/* FOOTER */}
          {handleSubmit && (
            <View style={[theme.alignCenter, theme.flex, theme.flexRow, theme.mt(5)]}>
              <View style={theme.flex1}>{footerElement}</View>
              <Button onPress={onClose} type={ButtonType.SECONDARY}>
                {cancelText ?? 'Cancel'}
              </Button>
              <Button onPress={handleSubmit} style={[theme.ml(4)]}>
                {submitText ?? 'Continue'}
              </Button>
            </View>
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
}
