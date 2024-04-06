import { ViewStyle } from 'react-native';

const getSpacingStyle = (path: string, value: number | 'auto'): ViewStyle => ({
  [path]: typeof value === 'number' ? value * PIXELS_PER_SPACE : value,
});

export const b = (spacing: number): ViewStyle => getSpacingStyle('bottom', spacing);

export const h = (spacing: number): ViewStyle => getSpacingStyle('height', spacing);

export const inset = (spacing: number): ViewStyle => ({
  bottom: spacing * PIXELS_PER_SPACE,
  left: spacing * PIXELS_PER_SPACE,
  right: spacing * PIXELS_PER_SPACE,
  top: spacing * PIXELS_PER_SPACE,
});

export const l = (spacing: number): ViewStyle => getSpacingStyle('left', spacing);

export const p = (spacing: number | 'auto'): ViewStyle => getSpacingStyle('padding', spacing);

export const pb = (spacing: number | 'auto'): ViewStyle =>
  getSpacingStyle('paddingBottom', spacing);

export const ph = (spacing: number | 'auto'): ViewStyle =>
  getSpacingStyle('paddingHorizontal', spacing);

const PIXELS_PER_SPACE = 4;

export const pl = (spacing: number | 'auto'): ViewStyle => getSpacingStyle('paddingLeft', spacing);

export const pr = (spacing: number | 'auto'): ViewStyle => getSpacingStyle('paddingRight', spacing);

export const pt = (spacing: number | 'auto'): ViewStyle => getSpacingStyle('paddingTop', spacing);

export const pv = (spacing: number | 'auto'): ViewStyle =>
  getSpacingStyle('paddingVertical', spacing);

export const mb = (spacing: number | 'auto'): ViewStyle => getSpacingStyle('marginBottom', spacing);

export const minHeight = (spacing: number): ViewStyle => getSpacingStyle('minHeight', spacing);

export const ml = (spacing: number | 'auto'): ViewStyle => getSpacingStyle('marginLeft', spacing);

export const mr = (spacing: number | 'auto'): ViewStyle => getSpacingStyle('marginRight', spacing);

export const mt = (spacing: number | 'auto'): ViewStyle => getSpacingStyle('marginTop', spacing);

export const mv = (spacing: number | 'auto'): ViewStyle =>
  getSpacingStyle('marginVertical', spacing);

export const r = (spacing: number): ViewStyle => getSpacingStyle('right', spacing);

export const rounded = (spacing?: number): ViewStyle =>
  spacing === undefined ? { borderRadius: 100 } : getSpacingStyle('borderRadius', spacing);

export const t = (spacing: number): ViewStyle => getSpacingStyle('top', spacing);

export const w = (spacing: number): ViewStyle => getSpacingStyle('width', spacing);
