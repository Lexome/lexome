import { LexomeStyleProps } from "@/theme"
import { Column, ColumnProps } from "./Column"

export type TreeViewItemProps<Item> = {
  item: Item,
  level: number
}

export type TreeViewProps<Item> = {
  data: Array<Item>,
  item: React.FC<TreeViewItemProps<Item>>,
} & ColumnProps

export const TreeView = <Item,>({
  data,
  item,
  ...props
}: TreeViewProps<Item>) => {
  const Item = item
  return <Column {...props}>{data.map(item => <Item item={item} level={0} />)}</Column>
}