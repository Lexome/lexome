import React, { useRef, useEffect } from 'react';
import { View, Text } from 'react-native';

import { TextSection as TextSectionSpec } from '@lexome/core';

type TextFormatting = TextSectionSpec['formatting'] & {
  emphasis?: number;
  selected?: boolean;
};

const SpaceElement: React.FC<{
  wordIndex?: number;
  word?: string;
  formatting: TextFormatting;
}> = ({ wordIndex, word, formatting }) => {
  const ref = useRef<View>(null);

  useEffect(() => {
    const fn = async (): Promise<false | undefined> => {
      if (ref.current == null) {
        return false;
      }

      (ref.current as any).measureInWindow((x: any) => {
        // console.log('spaceX', x, word);
      });
    };

    void fn();
  });

  const textStyle = {
    fontStyle: (formatting?.italics === true && 'italic') as 'italic',
    fontSize: 20,
    lineHeight: 26,
    wordSpacing: 1.2,
    background: formatting?.selected === true ? 'rgb(210, 230, 255)' : 'inherit',
  };

  return (
    <Text ref={ref} style={textStyle}>
      {' '}
    </Text>
  );
};

export default SpaceElement;
