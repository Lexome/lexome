import { useWindowDimensions, Dimensions, ViewStyle } from 'react-native';
import useScreen, { Screen } from './useScreen';
import * as theme from '../theme';

export const flex1 = { flex: 1 };

export const flexColumn = { flexDirection: 'column' as const };

export const flexRow = { flexDirection: 'row' as const };

const getSpacingStyle = (path: string, spacing: number): ViewStyle => ({
  [path]: spacing * 4
});

export const h = (spacing: number): ViewStyle => getSpacingStyle('height', spacing);

export const heightFull = { height: '100%' };

export const ml = (spacing: number): ViewStyle => getSpacingStyle('marginLeft', spacing);

export const mt = (spacing: number): ViewStyle => getSpacingStyle('marginTop', spacing);

export const p = (spacing: number): ViewStyle => getSpacingStyle('padding', spacing);

const getContentWidth = (screen: Screen): number => {
  switch (screen) {
    case Screen['2XL']:
      return 650;
    case Screen.XL:
      return 530;
    case Screen.LG:
      return 480;
    case Screen.MD:
      return Dimensions.get('window').width - 100;
    default:
      return Dimensions.get('window').width;
  }
};

const getPanelWidth = (screen: Screen): number => {
  switch (screen) {
    case Screen['2XL']:
      return 650;
    case Screen.XL:
      return 580;
    case Screen.LG:
      return 420;

    default:
      return Dimensions.get('window').width;
  }
};

const getContentPadding = (screen: Screen): number => {
  switch (screen) {
    case Screen['2XL']:
      return 50;
    case Screen.XL:
      return 50;
    case Screen.LG:
      return 30;
    default:
      return 0;
  }
};

export type Theme = typeof theme & {
  contentHeight: number;
  contentPadding: number;
  contentWidth: number;
  panelWidth: number;
};

const useTheme = (): Theme => {
  const screen = useScreen();
  const { height } = useWindowDimensions();
  const padding = getContentPadding(screen);

  const dynamicTheme = {
    ...theme,
    screen,
    contentWidth: getContentWidth(screen),
    contentHeight: screen === Screen.SM ? height - 120 : height - 2 * padding - 120,
    contentPadding: padding,
    panelWidth: getPanelWidth(screen),
  };

  return dynamicTheme;
};

export default useTheme;
