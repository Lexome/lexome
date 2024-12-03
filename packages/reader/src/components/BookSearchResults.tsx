import { Button, BUTTON_SIZE, BUTTON_TYPE } from "./design-system/Button"
import { Card, CARD_IMAGE_FIT } from "./design-system/Card"
import { Row } from "./design-system/Row"

import CollectionIcon from '@mui/icons-material/Bookmarks'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { CollectionBook } from "@/hooks/data/useStoreBookList"
import { CenterLoadingSpinner, LOADING_SPINNER_SIZE } from "./design-system/LoadingSpinner"
import { EmptyState } from "./design-system/EmptyState"
import { Column } from "./design-system/Column"

export const BookSearchResults = ({
  isLoading,
  books,
  emptyStateMessage
}: {
  isLoading: boolean,
  books: CollectionBook[],
  emptyStateMessage: string
}) => {
  return (
    <Column
      mt={2}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {isLoading && <CenterLoadingSpinner size={LOADING_SPINNER_SIZE.LG} />}
      {!isLoading && books.length === 0 && <EmptyState>{emptyStateMessage}</EmptyState>}
      {!isLoading && books.length > 0 && (
        <Row
          mt={2}
          style={{
            flexWrap: 'wrap'
          }}
        >
          {books.map((book) => (
            <Row mx={3} my={4}>
              <Card
                imageUri={book.coverUrl ?? ''}
                imageHeight="300px"
                imageWidth="200px"
                imageFit={CARD_IMAGE_FIT.CONTAIN}
                key={book.id}
              >
                <Row
                  pt={2}
                  style={{
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <Button
                    leftIcon={CollectionIcon}
                    onClick={() => {}}
                    label="Save"
                    size={BUTTON_SIZE.SM}
                    type={BUTTON_TYPE.OUTLINE}
                    style={{
                      marginRight: '8px',
                      flex: 1
                    }}
                  />
                  <Button
                    leftIcon={AutoStoriesIcon}
                    size={BUTTON_SIZE.SM}
                    label="Read"
                    type={BUTTON_TYPE.FILLED}
                    style={{
                      flex: 1
                    }}
                    onClick={() => {
                      window.location.href = `/reader?bookId=${book.id}`
                    }}
                  />
                </Row>
              </Card>
            </Row>
          ))}
        </Row>
      )}
    </Column>
  )
}

