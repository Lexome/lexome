export enum FONT_SIZE {
  SM='sm',
  MS='ms',
  MD='md',
  ML='ml',
  LG='lg',
  XL='xl',
  XXL='xxl'
}

export const fontSizes = {
  [FONT_SIZE.SM]: '14px',
  [FONT_SIZE.MS]: '16px',
  [FONT_SIZE.MD]: '20px',
  [FONT_SIZE.ML]: '24px',
  [FONT_SIZE.LG]: '32px',
  [FONT_SIZE.XL]: '40px',
  [FONT_SIZE.XXL]: '48px',
}

export enum FONT_WEIGHT {
  NORMAL='normal',
  SEMI_BOLD='semi_bold',
  BOLD='bold'
}

export const fontWeights = {
  [FONT_WEIGHT.NORMAL]: '400',
  [FONT_WEIGHT.SEMI_BOLD]: '600',
  [FONT_WEIGHT.BOLD]: '700'
}

export enum FONT_FAMILY {
  SANS_SERIF = 'sansSerif',
  HEADLINE = 'headline',
  OLD_SERIF = 'oldSerif',
  FRIENDLY_SERIF = 'friendlySerif',
  
}

export const fontFamilies = {
  [FONT_FAMILY.SANS_SERIF]: "Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
  [FONT_FAMILY.HEADLINE]: "Optima, Candara, 'Noto Sans', source-sans-pro, sans-serif",
  [FONT_FAMILY.OLD_SERIF]: "'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif",
  [FONT_FAMILY.FRIENDLY_SERIF]: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif"

}

export enum LINE_HEIGHT {
  CONDENSED='condensed',
  NORMAL='normal',
  RELAXED='relaxed'
}

export const lineHeights = {
  [LINE_HEIGHT.CONDENSED]: '1.2',
  [LINE_HEIGHT.NORMAL]: '1.3',
  [LINE_HEIGHT.RELAXED]: '1.6',
}

export enum TYPOGRAPHY_TYPE {
  TEXT_SMALL='text_small',
  TEXT_MEDIUM='text_medium',
  TEXT_LARGE='text_large',

  PARAGRAPH_SMALL='paragraph_small',
  PARAGRAPH_MEDIUM='paragraph_medium',
  PARAGRAPH_LARGE='paragraph_large',

  HEADLINE_SMALL='headline_small',
  HEADLINE_MEDIUM='headline_medium',
  HEADLINE_LARGE='headline_large'
}

export const typography = {
  [TYPOGRAPHY_TYPE.TEXT_SMALL]: {
    fontSize: FONT_SIZE.SM,
    lineHeight: LINE_HEIGHT.NORMAL,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.SANS_SERIF,
  },
  [TYPOGRAPHY_TYPE.TEXT_MEDIUM]: {
    fontSize: FONT_SIZE.MS,
    lineHeight: LINE_HEIGHT.NORMAL,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.SANS_SERIF,
  },
  [TYPOGRAPHY_TYPE.TEXT_LARGE]: {
    fontSize: FONT_SIZE.MD,
    lineHeight: LINE_HEIGHT.NORMAL,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.SANS_SERIF,
  },
  [TYPOGRAPHY_TYPE.PARAGRAPH_SMALL]: {
    fontSize: FONT_SIZE.SM,
    lineHeight: LINE_HEIGHT.RELAXED,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.SANS_SERIF,
  },
  [TYPOGRAPHY_TYPE.PARAGRAPH_MEDIUM]: {
    fontSize: FONT_SIZE.MS,
    lineHeight: LINE_HEIGHT.RELAXED,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.SANS_SERIF,
  },
  [TYPOGRAPHY_TYPE.PARAGRAPH_LARGE]: {
    fontSize: FONT_SIZE.MD,
    lineHeight: LINE_HEIGHT.RELAXED,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.SANS_SERIF,
  },
  [TYPOGRAPHY_TYPE.HEADLINE_SMALL]: {
    fontSize: FONT_SIZE.MD,
    lineHeight: LINE_HEIGHT.NORMAL,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.HEADLINE,
  },
  [TYPOGRAPHY_TYPE.HEADLINE_MEDIUM]: {
    fontSize: FONT_SIZE.ML,
    lineHeight: LINE_HEIGHT.NORMAL,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.HEADLINE,
  },
  [TYPOGRAPHY_TYPE.HEADLINE_LARGE]: {
    fontSize: FONT_SIZE.LG,
    lineHeight: LINE_HEIGHT.NORMAL,
    fontWeight: FONT_WEIGHT.NORMAL,
    fontFamily: FONT_FAMILY.HEADLINE,
  },
}