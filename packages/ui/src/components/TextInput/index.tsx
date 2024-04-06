import React from 'react';

import Input, { getMemoInput, InputProps } from '../Input';
import Main, { TextInputProps } from './Main';

const MemoInput = getMemoInput(Main);

export default function TextInput(props: InputProps & TextInputProps): JSX.Element {
  return (
    <Input<TextInputProps>
      component={MemoInput}
      componentProps={props}
      error={props.error}
      id={props.id}
      require={props.require}
    />
  );
}
