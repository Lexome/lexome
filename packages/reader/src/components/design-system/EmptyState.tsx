import { TYPOGRAPHY_TYPE } from "@/theme/font"
import { Column } from "./Column"
import { Text } from "./Text"
import { COLOR } from "@/theme/colors"
import { CenterInSpace } from "./CenterInSpace"

export const EmptyState = ({ children }: { children: React.ReactNode }) => {
  return (
    <CenterInSpace>
      <Text
        type={TYPOGRAPHY_TYPE.PARAGRAPH_LARGE}
        color={COLOR.GRAY}
      >
        {children}
      </Text>
    </CenterInSpace>
  )
}
