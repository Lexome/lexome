import { StyleXStyles } from "@stylexjs/stylex"
import { useMemo } from "react"

export type StyledElementProps<
  HtmlElement extends Element,
  BaseProps extends Record<string, any> = {},
> =
  BaseProps &
  UtilityStyleProps & 
  {
    styles?: StyleXStyles[]
  } &
  React.HTMLAttributes<HtmlElement>

export type UtilityStyleProps = {
  p?: number,
  pt?: number
  pr?: number,
  pb?: number,
  pl?: number,
  px?: number,
  py?: number,
  m?: number,
  mt?: number,
  mr?: number,
  mb?: number,
  ml?: number,
  mx?: number,
  my?: number,
}

const spacingVariableMap = {
  0: '0rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.5rem',
  6: '2rem',
  7: '3rem',
  8: '4rem',
}

const getSpacingVariable = (value: number): string | undefined => {
  if (value in spacingVariableMap) {
    return spacingVariableMap[value as keyof typeof spacingVariableMap]
  } 
}

export const useUtilityStyles = (utilProps: UtilityStyleProps): React.CSSProperties => {
  const {
    p,
    pt,
    pr,
    pb,
    pl,
    px,
    py,
    m,
    mt,
    mr,
    mb,
    ml,
    mx,
    my,
  } = utilProps

  const utilityStyles: React.CSSProperties = useMemo(() => {
    const styleVariables = {
      padding: p,
      paddingTop: pt || py,
      paddingRight: pr || px,
      paddingBottom: pb || py,
      paddingLeft: pl || px,
      margin: m,
      marginTop: mt || my,
      marginRight: mr || mx,
      marginBottom: mb || my,
      marginLeft: ml || mx,
    }

    const styles = {} as React.CSSProperties

    for (const _key in styleVariables) {
      const key = _key as keyof typeof styleVariables
      const passedUtil = styleVariables[key]

      if (passedUtil !== undefined) {
        const variable = getSpacingVariable(passedUtil)
        if (variable) {
          styles[key] = variable
        }
      }
    }

    return styles
  }, [p, pt, pr, pb, pl, px, py, m, mt, mr, mb, ml, mx, my])

  return utilityStyles
}
