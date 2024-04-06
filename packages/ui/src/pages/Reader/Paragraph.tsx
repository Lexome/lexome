import React from 'react';
import { View } from 'react-native';
import { Paragraph as ParagraphSpec, SECTION_TYPE } from '@lexome/core';
import styled from '../../styled';
import {
  CURSOR_DIRECTION,
  useBookNavigation
} from '../../context/bookNavigation/BookNavigationContext';
import TextSection from './TextSection';

const Paragraph = styled<{
  isPageRendering?: boolean;
  i?: number;
  cursorDirection?: CURSOR_DIRECTION;
}>(View, {
  styles: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    lineHeight: 2
  },
  computeStyles: ({ isPageRendering, cursorDirection, i }, { contentWidth }) => ({
    opacity: isPageRendering === true ? 0 : 1,
    marginBottom: (cursorDirection === CURSOR_DIRECTION.BACKWARDS && i !== 0) ? '16px' : '0px',
    marginTop: (cursorDirection === CURSOR_DIRECTION.FORWARDS && i !== 0) ? '16px' : '0px',
    width: contentWidth - 48,
  })
});

const intro: ParagraphSpec = {
  length: 13,
  type: SECTION_TYPE.PARAGRAPH,
  offset: 0,
  text: [{
    length: 13,
    offset: 0,
    type: SECTION_TYPE.TEXT,
    text: ("CLICK HERE TO MAKE A GENERAL COMMENT ABOUT AN INTERNATIONAL BILL OF RIGHTS.").split(' ')
  }]
};

export const IntroParagraph: React.FC<{
  index?: number;
}> = ({ index }) => {
  const { isPageRendering, cursorDirection } = useBookNavigation();

  return (
    <Paragraph
      isPageRendering={isPageRendering}
      i={index}
      cursorDirection={cursorDirection}
    >
      {intro.text.map((section) => {
        return (
          <TextSection
            key={section.offset}
            section={section}
            paragraphFormatting={{}}
            isIntro
          />
        );
      })}
    </Paragraph>
  );
};

const ParagraphWrapper: React.FC<{
  paragraph: ParagraphSpec;
  index?: number;
}> = ({ paragraph, index }) => {
  const { isPageRendering, cursorDirection } = useBookNavigation();

  return (
    <Paragraph
      isPageRendering={isPageRendering}
      i={index}
      cursorDirection={cursorDirection}
    >
      {paragraph.text.map((section) => {
        return (
          <TextSection
            key={section.offset}
            section={section}
            paragraphFormatting={paragraph.formatting || {}}
          />
        );
      })}
    </Paragraph>
  );
};

export default ParagraphWrapper;
