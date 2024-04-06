import React, { useState } from 'react';
import _ from 'lodash';

interface Input {
  id: string;
  require?: boolean;
}

interface Props<T> {
  children: JSX.Element | JSX.Element[];
  onChange: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: () => void;
  value: T;
}

export default function Form<T>({ children, onChange, onSubmit, value }: Props<T>): JSX.Element {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [isShowErrors, setIsShowErrors] = useState(false);

  const handleChange = (id: string, inputValue: unknown): void => {
    onChange((value) => _.set(_.cloneDeep(value) ?? {}, id, inputValue) as T);
  };

  const handleRegisterInput = (input: Input): void => {
    setInputs((inputs) => [...inputs, input]);
  };

  const handleSubmit = (): void => {
    setIsShowErrors(true);
    if (inputs.some((input) => input.require && !_.get(value, input.id))) return;
    onSubmit();
  };

  const handleUnregisterInput = (id: string): void => {
    setInputs((inputs) => inputs.filter((input) => input.id !== id));
  };

  return (
    <FormContext.Provider
      value={{
        isShowErrors,
        onChange: handleChange,
        onSubmit: handleSubmit,
        registerInput: handleRegisterInput,
        unregisterInput: handleUnregisterInput,
        value,
      }}>
      {children}
    </FormContext.Provider>
  );
}

export const FormContext = React.createContext<{
  isShowErrors: boolean;
  onChange: (id: string, value: unknown) => void;
  onSubmit: () => void;
  registerInput: (props: Input) => void;
  unregisterInput: (id: string) => void;
  value: unknown;
}>({
  isShowErrors: false,
  onChange: () => {},
  onSubmit: () => {},
  registerInput: () => {},
  unregisterInput: () => {},
  value: {},
});
