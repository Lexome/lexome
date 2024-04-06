import React, { useContext } from 'react';
import { Image, ImageStyle, Pressable } from 'react-native';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import _ from 'lodash';

import * as Core from '@lexome/core';

import { Text, TextAlign, TextType } from '../components';
import { BookContext, Page, PageContext } from '../context';
import * as theme from '../theme';

interface Props {
  authors: Array<Pick<Core.Author, 'name'>>;
  book: Pick<Core.Book, 'id' | 'title'>;
}

export default function BookThumbnail({ authors, book }: Props): JSX.Element {
  const { openBook } = useContext(BookContext);
  const { setPage } = useContext(PageContext);

  const handleOpenBook = async (partialBook: Pick<Core.Book, 'id' | 'title'>): Promise<void> => {
    let book: Core.Book | undefined;
    if ('authorIds' in partialBook) book = partialBook as Core.Book;
    else {
      const bookShapshot = await getDoc(doc(getFirestore(), 'book', partialBook.id));
      book = bookShapshot.data() as Core.Book;
    }
    void openBook(book);
    setPage(Page.READER);
  };

  return (
    <Pressable
      key={book.id}
      onPress={async () => await handleOpenBook(book)}
      style={[theme.rounded(4), theme.w(200 / 1.4 / 4)]}>
      <Image
        resizeMode="contain"
        source={{
          uri: `https://storage.googleapis.com/lexome_books/${book.id}/cover_thumbnail.jpg`,
        }}
        style={[
          theme.h(200 / 4) as ImageStyle,
          theme.mr(4) as ImageStyle,
          theme.rounded(5) as ImageStyle,
        ]}
      />
      <Text align={TextAlign.CENTER} numberOfLines={2} style={[theme.mt(1)]} type={TextType.BUTTON}>
        {book.title}
      </Text>
      <Text align={TextAlign.CENTER} numberOfLines={1}>
        {_.map(authors, 'name').join(', ')}
      </Text>
    </Pressable>
  );
}
