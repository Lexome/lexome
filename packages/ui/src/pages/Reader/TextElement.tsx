import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';

import { EnhancementPanelView, useBookNavigation, useEnhancement } from '../../context';
import { useTheme } from '../../hooks';
import { TextSection as TextSectionSpec, Paragraph } from '@lexome/core';

const checkIfShown = async (ref: View | null, theme: any): Promise<boolean> => {
  if (ref == null) {
    return false;
  }

  return await new Promise((resolve) => {
    ref.measureInWindow((x, y, width, height) => {
      resolve(y - height >= 0 && y < theme.contentHeight);
    });
  });
};

type TextFormatting = Paragraph['formatting'] & TextSectionSpec['formatting'] & {
  emphasis?: number;
  selected?: boolean;
  includeTrailingSpace?: boolean;
};

const isAlphanumeric = (text: string): boolean => /^[0-9a-zA-Z]$/.test(text);

const TextElement: React.FC<{
  wordIndex: number;
  formatting?: TextFormatting;
  annotations?: string[];
  onPress?: () => void;
  text: string;
  isIntro?: boolean
}> = ({ wordIndex, formatting, onPress, text, isIntro }) => {
  const ref = useRef<View>(null);
  const { expandCursorBounds } = useBookNavigation();
  const { areAnnotationsOn, openPanel, setEnhancementDetail, setView } = useEnhancement();
  const theme = useTheme();

  const [word, startingPunctuation, endingPunctuation] = useMemo(() => {
    let word = text;
    let startingPunctuation;
    let endingPunctuation;

    let lastNonAlphanumeric = -1;
    for (let i = 0; i < word.length; i++) {
      if (isAlphanumeric(word[i])) {
        break;
      } else {
        lastNonAlphanumeric = i;
      }
    }

    let firstNonAlphanumericFromEnd = word.length;
    for (let i = word.length - 1; i >= 0 && i <= word.length; i--) {
      if (isAlphanumeric(word[i])) {
        break;
      } else {
        firstNonAlphanumericFromEnd = i;
      }
    }

    if (lastNonAlphanumeric > -1) {
      startingPunctuation = word.slice(0, lastNonAlphanumeric + 1);
      word = word.slice(lastNonAlphanumeric + 1);
    }

    if (firstNonAlphanumericFromEnd < word.length) {
      endingPunctuation = word.slice(firstNonAlphanumericFromEnd);
      word = word.slice(0, firstNonAlphanumericFromEnd);
    }

    return [word, startingPunctuation, endingPunctuation];
  }, [text]);

  useEffect(() => {
    const fn = async (): Promise<void> => {
      const isShown = await checkIfShown(ref?.current, theme);
      if (ref?.current != null && isShown) {
        expandCursorBounds!(wordIndex);
      }
    };

    void fn();
  });

  const isTextAnnotated = isIntro || (areAnnotationsOn && formatting?.heading);
  const isBold = formatting?.heading || isTextAnnotated;

  const textStyle = {
    fontStyle: (formatting?.italics === true && 'italic') as 'italic',
    fontSize: 18,
    lineHeight: 24,
    color: isTextAnnotated ? 'rgb(50, 120, 255)' : 'rgb(50,50,50)',
    wordSpacing: 1,
    fontWeight: isBold ? ('600' as const) : ('400' as const),
    background: formatting?.selected === true ? 'rgb(210, 230, 255)' : 'inherit',
    cursor: isTextAnnotated ? 'pointer' : 'default',
  };

  const punctuationStyle = {
    fontStyle: (formatting?.italics === true && 'italic') as 'italic',
    fontSize: 18,
    lineHeight: 24,
    color: 'rgb(50,50,50)',
    wordSpacing: 1,
    fontWeight: '400' as const,
    background: formatting?.selected === true ? 'rgb(210, 230, 255)' : 'inherit',
  };

  const wrapperStyle = {
    marginRight: formatting?.includeTrailingSpace ? '4px' : undefined,
  };

  // const openAnnotation = () => {
  //   if (annotations && annotations.length > 0) {
  //     setEnhancementDetail(annotations[0]);
  //     setView(EnhancementPanelView.enhancement);
  //     openPanel();
  //   }
  // }

  return (
    <Text style={wrapperStyle}>
      {startingPunctuation && (
        <Text style={punctuationStyle}>
          {startingPunctuation}
        </Text>
      )}
      <Text ref={ref} style={textStyle} onPress={onPress}>
        {word}
      </Text>
      {endingPunctuation && <Text style={punctuationStyle}>{endingPunctuation}</Text>}
    </Text>
  );
};

export default TextElement;
