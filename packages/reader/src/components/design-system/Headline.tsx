import { styled } from "@/theme";
import { TYPOGRAPHY_TYPE } from "@/theme/font";

export enum HEADLINE_SIZE {
  SM='SM',
  MD='MD',
  LG='LG'
}

export const Headline = styled<{
  size: HEADLINE_SIZE
}>('div', ({ size }) => {
  let typography = TYPOGRAPHY_TYPE.HEADLINE_SMALL

  if (size === HEADLINE_SIZE.MD) {
    typography = TYPOGRAPHY_TYPE.HEADLINE_MEDIUM
  }

  if (size === HEADLINE_SIZE.LG) {
    typography = TYPOGRAPHY_TYPE.HEADLINE_LARGE
  }

  return {
    typography
  }
})