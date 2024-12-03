import { CenterLoadingSpinner } from "@/components/design-system/LoadingSpinner";
import { Row } from "@/components/design-system/Row";
import { Text } from "@/components/design-system/Text";
import { TreeView, TreeViewItemProps, TreeViewProps } from "@/components/design-system/TreeView";
import { TocItem, useToc } from "@/hooks/useToc";
import { useBook } from "@/providers/BookProvider";
import { TYPOGRAPHY_TYPE } from "@/theme/font";

function TreeViewItem({ item, level }: TreeViewItemProps<TocItem>) {
  const { rendition } = useBook()

  return (
    <Row
      pt={level === 0 ? 2 : 1}
      style={{
        paddingLeft: (level + 1) * 20,
        cursor: 'pointer'
      }}

    >
      <Text typography={TYPOGRAPHY_TYPE.TEXT_LARGE} onClick={() => {
        rendition?.display(item.href)
      }}>
        {item.label}
      </Text>
      {item.subitems && item.subitems.map((subitem) => <TreeViewItem item={subitem} level={level + 1} />)}
    </Row>
  )
}

export const TocTree = () => {
  const toc = useToc()

  if (!toc) return <CenterLoadingSpinner />

  return <TreeView<TocItem> data={toc} item={TreeViewItem} />
}
