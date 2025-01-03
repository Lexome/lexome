export enum COLOR {
  PRIMARY_DARK = 'primary_dark',
  PRIMARY = 'primary',
  PRIMARY_LIGHT = 'primary_light',
  PRIMARY_FAINT = 'primary_faint',
  SECONDARY_DARK = 'secondary_dark',
  SECONDARY = 'secondary',
  SECONDARY_LIGHT = 'secondary_light',
  ERROR_DARK = 'error_dark',
  ERROR = 'error',
  ERROR_LIGHT = 'error_light',
  SUCCESS_DARK = 'success_dark',
  SUCCESS = 'success',
  SUCCESS_LIGHT = 'success_light',
  FOREGROUND_STRONG = 'black',
  FOREGROUND_MEDIUM = 'dark_gray',
  FOREGROUND_SOFT = 'gray',
  BACKGROUND_SOFT = 'faint_gray',
  BACKGROUND_STRONG = 'white',
  BACKGROUND_MEDIUM = 'off_white',
  TRANSPARENT = 'transparent',
}

export const colors = {
  [COLOR.PRIMARY_DARK]: '#10182e',
  [COLOR.PRIMARY]: '#12469f',
  [COLOR.PRIMARY_LIGHT]: '#ccdffb',
  [COLOR.PRIMARY_FAINT]: '#f0f6ff',
  [COLOR.SECONDARY_DARK]: '10182e',
  [COLOR.SECONDARY]: '#302640',
  [COLOR.SECONDARY_LIGHT]: '#bda9c6',
  [COLOR.ERROR_DARK]: '#4d0305',
  [COLOR.ERROR]: '#b33b37',
  [COLOR.ERROR_LIGHT]: '#ffcdce',
  [COLOR.SUCCESS_DARK]: '#0c321e',
  [COLOR.SUCCESS]: '#33704e',
  [COLOR.SUCCESS_LIGHT]: '#e7ffea',
  [COLOR.FOREGROUND_STRONG]: '#000000',
  [COLOR.FOREGROUND_MEDIUM]: '#cccccc',
  [COLOR.FOREGROUND_SOFT]: '#767676',
  [COLOR.BACKGROUND_SOFT]: '#dddddd',
  [COLOR.BACKGROUND_STRONG]: '#ffffff',
  [COLOR.BACKGROUND_MEDIUM]: '#fafafa',
  [COLOR.TRANSPARENT]: 'rgba(0, 0, 0, 0)',
}
