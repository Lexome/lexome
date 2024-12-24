import { WebStyleProps, WebTheme, createStyled } from "@style-kit-n/web";
import { COLOR, colors } from "./colors";
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, fontFamilies, fontSizes, fontWeights, LINE_HEIGHT, lineHeights, typography, TYPOGRAPHY_TYPE } from "./font";

interface LexomeTheme extends WebTheme {
  colors: typeof colors,
  fontSizes: typeof fontSizes,
  fontFamilies: typeof fontFamilies,
  fontWeights: typeof fontWeights,
  lineHeights: typeof lineHeights,
  typography: typeof typography,
}

export enum THEME_MODE {
  LIGHT = 'light',
  DARK = 'dark'
}

export const theme: LexomeTheme = {
  colors,
  space: [
    '0px',
    '4px',
    '8px',
    '16px',
    '32px',
    '48px',
    '64px',
  ],
  fontSizes,
  fontFamilies,
  fontWeights,
  lineHeights,
  typography
}

const getDarkTheme = () => {
  const newTheme: LexomeTheme = {...theme}
  const newColors = {...theme.colors}

  newColors[COLOR.BACKGROUND_STRONG] = colors[COLOR.FOREGROUND_STRONG]
  newColors[COLOR.BACKGROUND_MEDIUM] = colors[COLOR.FOREGROUND_MEDIUM]
  newColors[COLOR.BACKGROUND_SOFT] = colors[COLOR.FOREGROUND_SOFT]
  newColors[COLOR.FOREGROUND_STRONG] = colors[COLOR.BACKGROUND_STRONG]
  newColors[COLOR.FOREGROUND_MEDIUM] = colors[COLOR.BACKGROUND_MEDIUM]
  newColors[COLOR.FOREGROUND_SOFT] = colors[COLOR.BACKGROUND_SOFT]

  return newTheme
)

export interface LexomeStyleProps extends WebStyleProps {
  color?: COLOR,
  fontSize?: FONT_SIZE,
  fontWeight?: FONT_WEIGHT,
  lineHeight?: LINE_HEIGHT,
  fontFamily?: FONT_FAMILY,
  typography?: TYPOGRAPHY_TYPE
}

export const styled = createStyled<LexomeStyleProps>()
