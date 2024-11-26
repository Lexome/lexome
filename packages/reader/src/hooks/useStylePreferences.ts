import { COLOR } from "@/theme/colors"
import { FONT_FAMILY, FONT_SIZE } from "@/theme/font"
import { useSharedState } from "./useSharedState"

const FONT_SIZES = ['12px', '16px', '20px', '24px', '28px']
const FONT_FAMILIES = ['sans-serif', 'serif', 'monospace']

type ColorScheme = {
  name: string,
  foreground: COLOR,
  background: COLOR
}

export enum COLOR_SCHEME_NAME {
  LIGHT_STANDARD = 'lightStandard',
  LIGHT_SOFT = 'lightSoft',
  LIGHT_INTENSE = 'lightIntense',
  DARK_INTENSE = 'darkIntense',
  DARK_STANDARD = 'darkStandard',
  DARK_SOFT = 'darkSoft'
}

export const colorSchemes: ColorScheme[] = [{
  name: COLOR_SCHEME_NAME.LIGHT_STANDARD,
  foreground: COLOR.DARK_GRAY,
  background: COLOR.WHITE
}, {
  name: COLOR_SCHEME_NAME.LIGHT_SOFT,
  foreground: COLOR.DARK_GRAY,
  background: COLOR.OFF_WHITE
}, {
  name: COLOR_SCHEME_NAME.LIGHT_INTENSE,
  foreground: COLOR.BLACK,
  background: COLOR.WHITE
}, {
  name: COLOR_SCHEME_NAME.DARK_STANDARD,
  foreground: COLOR.OFF_WHITE,
  background: COLOR.DARK_GRAY
}, {
  name: COLOR_SCHEME_NAME.DARK_SOFT,
  foreground: COLOR.OFF_WHITE,
  background: COLOR.DARK_GRAY
}, {
  name: COLOR_SCHEME_NAME.DARK_INTENSE,
  foreground: COLOR.WHITE,
  background: COLOR.BLACK
}]

export const useStylePreferences = () => {
  const [savedColorScheme, setSavedColorScheme] = useSharedState<COLOR_SCHEME_NAME>({
    key: 'saved-color-scheme',
    initialValue: COLOR_SCHEME_NAME.LIGHT_STANDARD
  })

  const [savedFontSize, setSavedFontSize] = useSharedState<string>({
    key: 'saved-font-size',
    initialValue: FONT_SIZE.MD
  })

  const [savedFontFamily, setSavedFontFamily] = useSharedState<string>({
    key: 'saved-font-family',
    initialValue: FONT_FAMILY.SANS_SERIF
  })

  return {
    fontSize: savedFontSize,
    colorScheme: savedColorScheme,
    fontFamily: savedFontFamily,
    setFontSize: setSavedFontSize,
    setColorScheme: setSavedColorScheme,
    setFontFamily: setSavedFontFamily
  }
}