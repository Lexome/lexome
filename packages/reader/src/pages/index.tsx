import React from 'react'
import { PreventSsr } from '@/components/PreventSsr'
import { CollectionBook, useStoreBookList } from '@/hooks/data/useStoreBookList'
import { Layout, Main, StickyTop, StickyTopScrollable, TopRightContent } from '@/components/layout'
import { SideNav } from '@/components/SideNav'
import { ReadableWidth } from '@/components/design-system/ReadableWidth'
import SearchIcon from '@mui/icons-material/Search'

import { useSharedState } from '@/hooks/useSharedState'
import { INPUT_SIZE, TextInput } from '@/components/design-system/fields/TextInput'
import { Column } from '@/components/design-system/Column'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { Row } from '@/components/design-system/Row'
import { BUTTON_TYPE, Button } from '@/components/design-system/Button'

import { LogInModal, useLogInModalState } from '@/components/LogInModal'
import { BookSearchResults } from '@/components/BookSearchResults'
import { STATE_KEY } from '@/constants'
import { ToastStack } from '@/components/design-system/ToastStack'

export default () => {
  const [query, setQuery] = useSharedState<string>({
    key: STATE_KEY.COLLECTION_QUERY,
    initialValue: ''
  })

  const { openModal } = useLogInModalState()

  const debouncedQuery = useDebouncedValue(query, 500)

  const { data, isLoading } = useStoreBookList({
    query: debouncedQuery
  })

  const books: CollectionBook[] = data?.getBooks?.records || []

  return (
    <PreventSsr>
      <Layout>
        <SideNav />
        <Main>
          <ReadableWidth>
            <Column
              style={{
                alignItems: 'flex-start',
              }}
            >
              <StickyTopScrollable>
                <StickyTop>
                  <Row mx={3} mt={2}>
                    <TextInput
                      leftIcon={SearchIcon}
                      size={INPUT_SIZE.MD}
                      onChange={setQuery}
                      value={query}
                      placeholder="Find a book"
                      label="Search"
                      style={{
                        width: '400px'
                      }}
                    />
                  </Row>
                </StickyTop>
                <BookSearchResults
                  books={books}
                  emptyStateMessage="No books found matching your search."
                  isLoading={isLoading}
                />
              </StickyTopScrollable>
            </Column>
          </ReadableWidth>
          <TopRightContent>
            <Row p={3}>
              <Button
                onClick={openModal}
                label="Log In"
                type={BUTTON_TYPE.TEXT}
              />
            </Row>
          </TopRightContent>
        </Main>
        <LogInModal />
      </Layout>
      <ToastStack />
    </PreventSsr>
  ) 
}
