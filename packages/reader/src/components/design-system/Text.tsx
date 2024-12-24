import { styled } from "@/theme";
import { COLOR } from "@/theme/colors";
import { FONT_WEIGHT } from "@/theme/font";

export const Text = styled('span', {
  color: COLOR.FOREGROUND_MEDIUM
})

export const Bold = styled('span', {
  fontWeight: FONT_WEIGHT.BOLD
})