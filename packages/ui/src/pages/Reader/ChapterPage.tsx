import React from 'react';
import { View, Text } from 'react-native';
import styled from '../../styled';
import { useBookNavigation } from '../../context/bookNavigation/BookNavigationContext';

const ChapterPageWrapper = styled(View, {
  styles: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  }
});

const ChapterTitle = styled(Text, {
  styles: {
    fontSize: 32,
    fontWeight: '600',
    color: 'rgb(80, 80, 80)'
  }
});

export default function ChapterPage(): JSX.Element {
  const { chapter } = useBookNavigation();
  return (
    <ChapterPageWrapper>
      {/* <ChapterTitle>{chapter?.name}</ChapterTitle> */}
      <ChapterTitle>Articles</ChapterTitle>
    </ChapterPageWrapper>
  );
}
