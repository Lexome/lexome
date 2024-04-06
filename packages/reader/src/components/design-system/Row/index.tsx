import { COLORS } from "../../../theme/colors.stylex"
import stylex, { StyleXStyles, props } from "@stylexjs/stylex"
import { StyledElementProps, useUtilityStyles } from "../utils"

const rowStyles = stylex.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
})

type RowProps = StyledElementProps<HTMLDivElement>

export const Row: React.FC<RowProps> = ({
  styles,
  children,
  ...props
}) => {
  const utilityStyles = useUtilityStyles(props)

  return (
    <div
      {...stylex.props(
        rowStyles.row,
        ...(styles || [])
      )}
      style={utilityStyles}
    >
      {children}
    </div>
  )
}