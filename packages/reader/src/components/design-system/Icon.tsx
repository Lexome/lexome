import { COLOR } from "@/theme/colors"
import { FONT_SIZE } from "@/theme/font"
import { Row } from "./Row"

type IconProps = {
  size: FONT_SIZE,
  color: COLOR,
  icon: React.FC<any>
}

export const Icon: React.FC<IconProps> = ({
  size,
  color,
  icon
}) => {
  const Icon = icon

  return (
    <Row
      fontSize={size}
      color={color}
      style={{alignItems: 'center', justifyContent: 'center'}}
    >
      <Icon color="inherit" fontSize="inherit" />
    </Row>
  ) 
}