import React, { CSSProperties } from "react";
import {View, Text, TouchableOpacity, TouchableOpacityProps, TextProps} from 'react-native';
import useTheme, { Theme } from "./hooks/useTheme";

type ComputeStyleFn<P, StyleProp=CSSProperties> = (props: P, theme?: any) => StyleProp;

type ReactNativeElement = typeof View | typeof Text | typeof TouchableOpacity;

type StyledComponent<
  P,
  BaseElement,
  StyleProp=CSSProperties,
> = React.FC<
  P
> & {
  styles: StyleProp;
  computeStyleFns: ComputeStyleFn<P, StyleProp>[];
  root: BaseElement;
}

type GetHelperStyles<HelperStyles> = (helperStyles: HelperStyles) => CSSProperties

function createStyled<
  BaseElement,
  BaseProps,
  StyleProp=CSSProperties,
  HelperProps={},
>(params?: {
  getHelperStyles?: GetHelperStyles<HelperProps>
}) {
  return function<Props={}, ParentProps={}>(
    element: BaseElement | StyledComponent<BaseProps & ParentProps, BaseElement, StyleProp>,
    styleParams?: {
      styles?: StyleProp;
      computeStyles?: (props: Props, theme: Theme) => StyleProp,
    }) {
    return _styled<BaseElement, BaseProps & Props, BaseProps & ParentProps, HelperProps, StyleProp>(
      element,
      styleParams
    );
  }
};

function _styled<BaseElement, Props={}, ParentProps={}, HelperProps={}, StyleProp={}>(
  element: BaseElement | StyledComponent<ParentProps, BaseElement, StyleProp>,
  styleParams?: {
    styles?: StyleProp;
    computeStyles?: (props: Props, theme: Theme) => StyleProp,
  },
  getHelperStyles?: GetHelperStyles<HelperProps>
): StyledComponent<Props & ParentProps, BaseElement, StyleProp> {
  const { styles, computeStyles } = styleParams || {};

  let root: BaseElement;
  let mergedStyles = {...styles} as StyleProp;
  let computeStyleFns: ComputeStyleFn<Props & ParentProps, StyleProp>[];

  const isRootElement = !('root' in element);

  if (isRootElement) {
    root = element;
    computeStyleFns = computeStyles ? [computeStyles] : []
  } else {
    const parentComponent = element as StyledComponent<ParentProps, BaseElement, StyleProp>;
    mergedStyles = {
      ...mergedStyles,
      ...parentComponent.styles
    }
    root = parentComponent.root;
    computeStyleFns = computeStyles ? [...parentComponent.computeStyleFns, computeStyles] : parentComponent.computeStyleFns
  } 

  const component: React.FC<Props & ParentProps> = (props) => {
    const theme = useTheme();

    let allStyles: StyleProp = {
      ...mergedStyles
    }

    // let helperStyles: CSSProperties = getHelperStyles(props);

    for (const computeStyleFn of computeStyleFns) {
      allStyles = {
        ...allStyles,
        ...computeStyleFn(props, theme)
      };
    }

    const el = React.createElement(root as any, {
      ...props,
      style: allStyles as any
    });

    return el;
  }

  const styledComponent = component as StyledComponent<Props & ParentProps, BaseElement, StyleProp>;

  styledComponent.styles = mergedStyles;
  styledComponent.root = root;
  styledComponent.computeStyleFns = computeStyleFns;

  return styledComponent;
}

const styled = createStyled<ReactNativeElement, TouchableOpacityProps, TouchableOpacityProps['style'] | TextProps['style']>()

export default styled;