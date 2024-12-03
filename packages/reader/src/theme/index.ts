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

export interface LexomeStyleProps extends WebStyleProps {
  color?: COLOR,
  fontSize?: FONT_SIZE,
  fontWeight?: FONT_WEIGHT,
  lineHeight?: LINE_HEIGHT,
  fontFamily?: FONT_FAMILY,
  typography?: TYPOGRAPHY_TYPE
}

export const styled = createStyled<LexomeStyleProps>()
