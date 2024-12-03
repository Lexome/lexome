import { Text } from "@/components/design-system/Text"
import { TocTree } from "./TocTree"
import { Column } from "@/components/design-system/Column"
import { TYPOGRAPHY_TYPE } from "@/theme/font"

export const TableOfContents = () => {
  return (
    <Column mt={3}>
      <Text typography={TYPOGRAPHY_TYPE.HEADLINE_LARGE}>Table of Contents</Text>
      <TocTree />
    </Column>
  )
}