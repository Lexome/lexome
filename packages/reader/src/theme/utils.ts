import { stylex } from "@stylexjs/stylex";
import { COLORS } from "./colors.stylex";
import { SPACING } from "./spacing.stylex";
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from "./font.stylex";

export const utils = stylex.create({
  m1: {
    margin: SPACING['1'],
  },
  m2: {
    margin: SPACING['2'],
  },
  m3: {
    margin: SPACING['3'],
  },
  m4: {
    margin: SPACING['4'],
  },
  m5: {
    margin: SPACING['5'],
  },
  m6: {
    margin: SPACING['6'],
  },
  m7: {
    margin: SPACING['7'],
  },
  m8: {
    margin: SPACING['8'],
  },
  my1: {
    marginTop: SPACING['1'],
    marginBottom: SPACING['1'],
  },
  my2: {
    marginTop: SPACING['2'],
    marginBottom: SPACING['2'],
  },
  my3: {
    marginTop: SPACING['3'],
    marginBottom: SPACING['3'],
  },
  my4: {
    marginTop: SPACING['4'],
    marginBottom: SPACING['4'],
  },
  my5: {
    marginTop: SPACING['5'],
    marginBottom: SPACING['5'],
  },
  my6: {
    marginTop: SPACING['6'],
    marginBottom: SPACING['6'],
  },
  my7: {
    marginTop: SPACING['7'],
    marginBottom: SPACING['7'],
  },
  my8: {
    marginTop: SPACING['8'],
    marginBottom: SPACING['8'],
  },
  mx1: {
    marginLeft: SPACING['1'],
    marginRight: SPACING['1'],
  },
  mx2: {
    marginLeft: SPACING['2'],
    marginRight: SPACING['2'],
  },
  mx3: {
    marginLeft: SPACING['3'],
    marginRight: SPACING['3'],
  },
  mx4: {
    marginLeft: SPACING['4'],
    marginRight: SPACING['4'],
  },
  mx5: {
    marginLeft: SPACING['5'],
    marginRight: SPACING['5'],
  },
  mx6: {
    marginLeft: SPACING['6'],
    marginRight: SPACING['6'],
  },
  mx7: {
    marginLeft: SPACING['7'],
    marginRight: SPACING['7'],
  },
  mx8: {
    marginLeft: SPACING['8'],
    marginRight: SPACING['8'],
  },
  p1: {
    padding: SPACING['1'],
  },
  p2: {
    padding: SPACING['2'],
  },
  p3: {
    padding: SPACING['3'],
  },
  p4: {
    padding: SPACING['4'],
  },
  p5: {
    padding: SPACING['5'],
  },
  p6: {
    padding: SPACING['6'],
  },
  p7: {
    padding: SPACING['7'],
  },
  p8: {
    padding: SPACING['8'],
  },
  py1: {
    paddingTop: SPACING['1'],
    paddingBottom: SPACING['1'],
  },
  py2: {
    paddingTop: SPACING['2'],
    paddingBottom: SPACING['2'],
  },
  py3: {
    paddingTop: SPACING['3'],
    paddingBottom: SPACING['3'],
  },
  py4: {
    paddingTop: SPACING['4'],
    paddingBottom: SPACING['4'],
  },
  py5: {
    paddingTop: SPACING['5'],
    paddingBottom: SPACING['5'],
  },
  py6: {
    paddingTop: SPACING['6'],
    paddingBottom: SPACING['6'],
  },
  py7: {
    paddingTop: SPACING['7'],
    paddingBottom: SPACING['7'],
  },
  py8: {
    paddingTop: SPACING['8'],
    paddingBottom: SPACING['8'],
  },
  px1: {
    paddingLeft: SPACING['1'],
    paddingRight: SPACING['1'],
  },
  px2: {
    paddingLeft: SPACING['2'],
    paddingRight: SPACING['2'],
  },
  px3: {
    paddingLeft: SPACING['3'],
    paddingRight: SPACING['3'],
  },
  px4: {
    paddingLeft: SPACING['4'],
    paddingRight: SPACING['4'],
  },
  px5: {
    paddingLeft: SPACING['5'],
    paddingRight: SPACING['5'],
  },
  px6: {
    paddingLeft: SPACING['6'],
    paddingRight: SPACING['6'],
  },
  px7: {
    paddingLeft: SPACING['7'],
    paddingRight: SPACING['7'],
  },
  px8: {
    paddingLeft: SPACING['8'],
    paddingRight: SPACING['8'],
  },
  textSmall: {
    fontFamily: FONT_FAMILY.sansSerif,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.regular
  },
  textMedium: {
    fontFamily: FONT_FAMILY.sansSerif,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.regular
  },
  textLarge: {
    fontFamily: FONT_FAMILY.sansSerif,
    fontSize: FONT_SIZE.ml,
    lineHeight: LINE_HEIGHT.normal,
    fontWeight: FONT_WEIGHT.regular
  },
  paragraphSmall: {
    fontFamily: FONT_FAMILY.sansSerif,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.relaxed,
    fontWeight: FONT_WEIGHT.regular
  },
  paragraphMedium: {
    fontFamily: FONT_FAMILY.sansSerif,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.relaxed,
    fontWeight: FONT_WEIGHT.regular
  },
  paragraphLarge: {
    fontFamily: FONT_FAMILY.sansSerif,
    fontSize: FONT_SIZE.ml,
    lineHeight: LINE_HEIGHT.relaxed,
    fontWeight: FONT_WEIGHT.regular
  },
})