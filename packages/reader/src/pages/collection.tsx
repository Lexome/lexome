import React from 'react'
import { PreventSsr } from '@/components/PreventSsr'
import { Layout, Main, StickyTopScrollable, StickyTop, TopRightContent } from '@/components/layout'
import SearchIcon from '@mui/icons-material/Search'
import { ReadableWidth } from '@/components/design-system/ReadableWidth'

import { useSharedState } from '@/hooks/useSharedState'
import { TextInput } from '@/components/design-system/fields/TextInput'
import { Column } from '@/components/design-system/Column'
import { Row } from '@/components/design-system/Row'
import { BUTTON_TYPE, Button } from '@/components/design-system/Button'

import { LogInModal, useLogInModalState } from '@/components/LogInModal'
import { SideNav } from '@/components/SideNav'
import { STATE_KEY } from '@/constants'
import { BookSearchResults } from '@/components/BookSearchResults'

export default () => {
  const [query, setQuery] = useSharedState<string>({
    key: STATE_KEY.COLLECTION_QUERY,
    initialValue: ''
  })

  const { openModal } = useLogInModalState()

  const books: any[] = []

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
                  <Row mx={3}>
                    <TextInput
                      leftIcon={SearchIcon}
                      onChange={setQuery}
                      value={query}
                      placeholder="Search your collection"
                      style={{
                        width: '400px'
                      }}
                    />
                  </Row>
                </StickyTop>
                <BookSearchResults
                  isLoading={false}
                  books={books}
                  emptyStateMessage={query ? 'No books found matching your search.' : 'Your collection is empty.'}
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
    </PreventSsr>
  ) 
}
