import React from 'react';
import { TextSection as TextSectionSpec } from '@lexome/core';
import { useAnnotationLocations } from '../../context/annotations/AnnotationLocationsContext';
import TextElement from './TextElement';
import { useDiscussionTags } from '../../hooks/useTags';
import { useNavigate } from 'react-router-dom';
import { useEnhancement } from '../../context';

const TextSection: React.FC<{
  section: TextSectionSpec;
  paragraphFormatting: {
    heading?: boolean;
  };
  isIntro?: boolean
}> = ({ section, paragraphFormatting, isIntro }) => {
  const { annotationMap } = useAnnotationLocations();
  const { areAnnotationsOn, openPanel } = useEnhancement();
  const navigate = useNavigate();
  const {data: tags} = useDiscussionTags();

  // console.log('tags', tags);

  let wordIndex = section.offset;

  const getNextIndex = (): number => {
    const index = wordIndex;
    wordIndex++;

    return index;
  };

  let onPress: (() => void) | undefined = undefined;

  if (paragraphFormatting.heading && areAnnotationsOn) {
    const joinedText = section.text.join(' ');
    const copyTags = tags ? [...tags] : [];
    copyTags.reverse();

    const tag = copyTags.find(tag => joinedText.includes(tag.label));
    if (tag) {
      onPress = () => {
        navigate(`/?tag=${tag.id}`);
        openPanel();
      }
    }
  }

  if (isIntro) {
    onPress = () => {
      navigate('/?tag=');
      openPanel();
    }
  }

  return (
    <>
      {section.text.map((text, i) => {
        const index = getNextIndex();
        const includeTrailingSpace =
          i < section.text.length - 1 || section.formatting?.trailingSpace;

        const annotations = annotationMap?.[index];

        const emphasis = typeof annotations?.annotations?.length === 'number'
          ? annotations?.annotations?.length
          : 0

        const wordStyles = {
          ...section.formatting,
          selected: annotations?.selected,
          includeTrailingSpace,
          heading: paragraphFormatting.heading,
          emphasis
        };

        return (
            <TextElement
              wordIndex={index}
              formatting={wordStyles}
              annotations={annotations?.annotations}
              key={`${text}__${wordIndex}`}
              onPress={onPress}
              text={text}
              isIntro={isIntro}
            />
        );
      })}
    </>
  );
};

export default TextSection;
