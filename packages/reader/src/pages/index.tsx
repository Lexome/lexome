import React, { useState } from 'react'
import { PreventSsr } from '@/components/PreventSsr'
import { useStoreBookList } from '@/hooks/data/useStoreBookList'
import { Layout, Main, NavItem, NavTopItems, ReadableWidth, SideNav, TopRightContent } from '@/components/layout'

import LibraryIcon from '@mui/icons-material/AccountBalance'
import CollectionIcon from '@mui/icons-material/Bookmarks'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import SearchIcon from '@mui/icons-material/Search'

import { useSharedState } from '@/hooks/useSharedState'
import { TextInput } from '@/components/design-system/fields/TextInput'
import { Column } from '@/components/design-system/Column'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { CARD_IMAGE_FIT, Card } from '@/components/design-system/Card'
import { Row } from '@/components/design-system/Row'
import { BUTTON_SIZE, BUTTON_TYPE, Button } from '@/components/design-system/Button'

import logo from '../../static/logo.svg'
import { LogInModal, useLogInModalState } from '@/components/LogInModal'

export default () => {
  const [query, setQuery] = useSharedState<string>('main-query', '')
  const { openModal } = useLogInModalState()

  const debouncedQuery = useDebouncedValue(query, 500)

  const { data } = useStoreBookList({
    query: debouncedQuery
  })

  const navItems = [
    {
      uri: '/library',
      label: 'Library',
      icon: LibraryIcon,
      isSelected: true
    },
    {
      uri: '/collection',
      label: 'Collection',
      icon: CollectionIcon,
      isSelected: false
    },
    {
    uri: '/reader',
    label: 'Reader',
    icon: AutoStoriesIcon,
    isSelected: false
  }]

  return (
    <PreventSsr>
      <Layout>
        <SideNav>
          <NavTopItems>
            <Row
              mt={3}
              style={{
                height: '48px',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src={logo.src}
                style={{
                  height: '48px',
                  width: '48px'
                }}
              />
            </Row>
            {navItems.map((item) => (
              <NavItem
                key={item.uri}
                uri={item.uri}
                label={item.label}
                icon={item.icon}
                isSelected={item.isSelected}
              />
            ))}
          </NavTopItems>
        </SideNav>
        <Main>
          <ReadableWidth>
            <Column
              style={{
                alignItems: 'flex-start',
              }}
            >
              <Row mx={3}>
                <TextInput
                  leftIcon={SearchIcon}
                  onChange={setQuery}
                  value={query}
                  placeholder="Find a book"
                  style={{
                    width: '400px'
                  }}
                />
              </Row>
              <Row
                mt={2}
                style={{
                  flexWrap: 'wrap'
                }}
              >
                {data?.getBooks?.records?.map((book) => (
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
