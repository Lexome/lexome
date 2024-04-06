import { ViewStyle } from 'react-native';

import { Color } from './color';

export * from './color';
export * from './spacing';

export const absolute = { position: 'absolute' as const };

export const alignCenter = { alignItems: 'center' as const };

export const alignEnd = { alignItems: 'flex-end' as const };

export const bg = (backgroundColor: Color, opacity?: number): ViewStyle =>
  getColorStyle('backgroundColor', backgroundColor, opacity);

export const border = (
  borderColor: Color = Color.GRAY_LIGHT,
  borderWidth: number = 1,
): ViewStyle => ({
  borderColor,
  borderWidth,
});

export const bb = (borderBottomColor: Color = Color.GRAY_LIGHT): ViewStyle => ({
  borderBottomColor,
  borderBottomWidth: 1,
});

export const bt = (borderTopColor: Color = Color.GRAY_LIGHT): ViewStyle => ({
  borderTopColor,
  borderTopWidth: 1,
});

export const cursorPointer = { cursor: 'pointer' as const };

export const flex = { display: 'flex' as const };

export const flex1 = { flex: 1 };

export const flexColumn = { flexDirection: 'column' as const };

export const flexRow = { flexDirection: 'row' as const };

export const flexWrap = { flexWrap: 'wrap' as const };

export enum Font {
  ROBOTO_BOLD = 'sans-serif',
  ROBOTO_REGULAR = 'sans-serif',
}

const getColorStyle = (path: string, color: Color, opacity?: number): ViewStyle => {
  if (opacity === undefined) return { [path]: color };
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  const r = parseInt(result![1], 16);
  const g = parseInt(result![2], 16);
  const b = parseInt(result![3], 16);
  return { [path]: `rgba(${r}, ${g}, ${b}, ${opacity})` };
};

export const heightFull = { height: '100%' };

export const heightScreen = { height: '100vh' };

export const justifyCenter = { justifyContent: 'center' as const };

export const justifyEnd = { justifyContent: 'flex-end' as const };

export const minHeightScreen = { minHeight: '100vh' };

export const opacity = (opacity: number): ViewStyle => ({ opacity });

export const relative = { position: 'relative' as const };

export const underline = { textDecorationLine: 'underline' as const };

export const widthFull = { width: '100%' };

export const zIndex = (zIndex: number): ViewStyle => ({ zIndex });
