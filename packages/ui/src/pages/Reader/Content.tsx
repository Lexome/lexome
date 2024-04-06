import React, { useContext } from 'react';
import { View, Image } from 'react-native';
import isEqual from 'lodash/isEqual';

import * as Core from '@lexome/core';

import { BookContext, CURSOR_DIRECTION, useBookNavigation } from '../../context';
import styled from '../../styled';
import ChapterPage from './ChapterPage';
import Paragraph, { IntroParagraph } from './Paragraph';

const ContentWrapper = styled<{
  cursorDirection: CURSOR_DIRECTION;
}>(View, {
  styles: {
    display: 'flex',
    height: '100%',
    fontFamily: 'helvetica',
  },
  computeStyles: ({ cursorDirection }, theme) => ({
    flexDirection: cursorDirection === CURSOR_DIRECTION.FORWARDS ? 'column' : 'column-reverse',
    height: theme.contentHeight,
    paddingTop: theme.contentPadding,
  }),
});

const eleanorLivesImage = require('../../../eleanorLives.png');

const TitlePage = (): JSX.Element | null => {
  const { book } = useContext(BookContext);

  if (!book) return null;

  return (
    <View>
      <Image
        resizeMode="contain"
        source={{ uri: eleanorLivesImage }}
        style={{ height: '67vh' }}
      />
      {/* <Text align={TextAlign.CENTER} type={TextType.HEADLINE}>
        {book.title}
      </Text> */}
    </View>
  );
};

export default function Content(): JSX.Element | null {
  const { cursor, cursorDirection, chapter, chapterLocation } = useBookNavigation();

  if (isEqual(chapterLocation, [])) {
    return (
      <ContentWrapper cursorDirection={CURSOR_DIRECTION.FORWARDS}>
        <TitlePage />
      </ContentWrapper>
    );
  }

  if (chapter == null) return null;

  if (cursor != null && cursor[0] === -1) {
    return (
      <ContentWrapper cursorDirection={CURSOR_DIRECTION.FORWARDS}>
        <ChapterPage />
      </ContentWrapper>
    );
  }

  const showIntro = cursor && cursor[0] === 0;

  if (chapter.content[0].type === Core.SECTION_TYPE.PARAGRAPH) {
    if (cursorDirection === CURSOR_DIRECTION.FORWARDS) {
      return (
        <ContentWrapper cursorDirection={cursorDirection}>
          {showIntro ? (
            <IntroParagraph index={0} />
          ): null }
          {chapter.content.map((paragraph, i) => (
            <Paragraph paragraph={paragraph as Core.Paragraph} key={i} index={i + (showIntro ? 1 : 0)} />
          ))}
        </ContentWrapper>
      );
    } else if (cursorDirection === CURSOR_DIRECTION.BACKWARDS) {
      return (
        <ContentWrapper cursorDirection={cursorDirection}>
          {chapter.content
            .slice()
            .reverse()
            .map((paragraph, i) => (
              <Paragraph paragraph={paragraph as Core.Paragraph} key={i} index={i}/>
            ))}
        </ContentWrapper>
      );
    }
  }

  return null;
}
