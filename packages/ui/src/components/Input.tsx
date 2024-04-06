import React, {
  FunctionComponent,
  memo,
  MemoExoticComponent,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import _ from 'lodash';

import { FormContext } from './Form';

export function getMemoInput<T extends { error?: string; value?: unknown }>(
  component: FunctionComponent<T>
): any {
  return memo<T>(
    component,
    (prev, next) => prev.error === next.error && _.isEqual(prev.value, next.value)
  );
}

export interface InputProps {
  error?: string;
  id?: string;
  require?: boolean;
}

type Props<T> = InputProps & {
  component: MemoExoticComponent<(props: T & { children?: ReactNode }) => JSX.Element>;
  componentProps: React.Attributes & React.PropsWithRef<T & { children?: ReactNode }>;
};

export default function Input<T>({
  component,
  componentProps,
  error,
  id,
  require,
}: Props<T>): JSX.Element {
  const form = useContext(FormContext);

  useEffect(() => {
    if (id) form.registerInput({ id, require });

    return () => {
      if (id) form.unregisterInput(id);
    };
  }, []);

  if (id) {
    const value = _.get(form.value, id);
    let localError;

    if (form.isShowErrors && require && !value) {
      const article = ['a', 'e', 'i', 'o', 'u'].includes(id[0]) ? 'an' : 'a';
      localError = `Enter ${article} ${_.startCase(id).toLowerCase()}`;
    }

    return React.createElement(component, {
      ...componentProps,
      error: error ?? localError,
      id,
      onChange: (value?: string) => form.onChange(id, value),
      value: typeof value === 'string' || typeof value === 'undefined' ? value : undefined,
    });
  }

  return React.createElement(component, componentProps);
}
