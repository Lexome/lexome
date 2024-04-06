import React, { useEffect, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import _ from 'lodash';

import * as theme from '../../theme';
import Icon, { IconName } from '../Icon';
import Text, { TextType } from '../Text';
import TextInput from './TextInput';

export interface TextInputProps {
  autoFocus?: boolean;
  debounceMilliseconds?: number;
  disable?: boolean;
  error?: string;
  hideLabel?: boolean;
  id?: string;
  inputStyle?: ViewStyle[];
  isSearch?: boolean;
  onChange?: (value?: string) => void;
  onFocus?: (isFocused: boolean) => void;
  placeholder?: string;
  style?: ViewStyle[];
  value?: string;
}

export default function Main({
  autoFocus,
  disable,
  debounceMilliseconds,
  error,
  hideLabel,
  id,
  inputStyle = [],
  isSearch,
  onChange,
  onFocus,
  placeholder,
  style = [],
  value = '',
}: TextInputProps): JSX.Element {
  const [localValue, setLocalValue] = useState<string>(value);
  const [timeoutId, setTimeoutId] = useState<number>();

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  const label =
    placeholder !== undefined ? placeholder : id !== undefined ? _.startCase(id) : undefined;

  const handleChange = (text?: string): void => {
    const newValue = text || undefined; // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    setLocalValue(newValue ?? '');

    if (debounceMilliseconds) {
      clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        onChange?.(newValue);
      }, debounceMilliseconds);
      setTimeoutId(Number(newTimeoutId));
    } else onChange?.(newValue);
  };

  return (
    <View style={[theme.mb(5), ...style]}>
      {!hideLabel && (
        <View style={[theme.flexRow]}>
          {disable && <Icon name={IconName.LOCK} style={[theme.mr(1)]} />}
          <Text style={[theme.mb(2)]} type={TextType.LABEL}>
            {label}
          </Text>
        </View>
      )}

      <TextInput
        autoFocus={autoFocus}
        disable={disable}
        error={error}
        isSearch={isSearch}
        onChange={handleChange}
        onFocus={onFocus}
        placeholder={hideLabel === true || placeholder ? label : undefined}
        style={inputStyle}
        value={localValue}
      />

      {error && (
        <View style={[theme.alignCenter, theme.flex, theme.flexRow, theme.mt(2)]}>
          <Icon color={theme.Color.DANGER} name={IconName.INFO} />
          <Text color={theme.Color.DANGER} style={[theme.ml(1)]} type={TextType.HELPER}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
