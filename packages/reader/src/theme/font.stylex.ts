import { stylex } from "@stylexjs/stylex";

export const FONT_SIZE = stylex.defineVars({
  sm: '14px',
  ms: '16px',
  md: '20px',
  ml: '24px',
  lg: '32px',
  xl: '40px',
  xxl: '48px',
})

export const FONT_WEIGHT = stylex.defineVars({
  regular: '400',
  semiBold: '600', 
  bold: '700',
})

export const FONT_FAMILY = stylex.defineVars({
  sansSerif: "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif"
})

export const LINE_HEIGHT = stylex.defineVars({
  condensed: '1.2',
  normal: '1.3',
  relaxed: '1.5',
})

