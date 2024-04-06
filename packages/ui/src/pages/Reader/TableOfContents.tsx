import React, { useContext } from 'react';
import { Image, View } from 'react-native';
import nullthrows from 'nullthrows';

import { Button, ButtonType, List, Text, TextAlign } from '../../components';
import { BookContext, Page, PageContext, useBookNavigation } from '../../context';
import { Screen, useScreen, useTheme } from '../../hooks';

export const articles = [
{
  title: 'Preamble',
  index: 0,
  end: 44
}, {
  title: 'Article 1',
  index: 45,
  end: 78
}, {
  title: 'Article 2',
  index: 79,
  end: 154
}, {
  title: 'Article 3',
  index: 155,
  end: 220
}, {
  title: 'Article 4',
  index: 221,
  end: 249
}, {
  title: 'Article 5',
  index: 250,
  end: 287
}, {
  title: 'Article 6',
  index: 288,
  end: 322
}, {
  title: 'Article 7',
  index: 323,
  end: 357
}, {
  title: 'Article 8',
  index: 358,
  end: 369
}, {
  title: 'Article 9',
  index: 370,
  end: 441
}, {
  title: 'Article 10',
  index: 442,
  end: 476
}, {
  title: 'Article 11',
  index: 477,
  end: 656
}, {
  title: 'Article 12',
  index: 657,
  end: 703
}, {
  title: 'Article 13',
  index: 704,
  end: 754
}, {
  title: 'Article 14',
  index: 755,
  end: 864
}, {
  title: 'Article 15',
  index: 865,
  end: 977
}, {
  title: 'Article 16',
  index: 978,
  end: 1012
}, {
  title: 'Article 17',
  index: 1013,
  end: 1058
}, {
  title: 'Article 18',
  index: 1059,
  end: 1152
}, {
  title: 'Article 19',
  index: 1153,
  end: 1192
}, {
  title: 'Article 20',
  index: 1193,
  end: 1387
}, {
  title: 'Article 21',
  index: 1388,
  end: 1471
}, {
  title: 'Article 22',
  index: 1472,
  end: 1541
}, {
  title: 'Article 23',
  index: 1542,
  end: 1602
}, {
  title: 'Article 24',
  index: 1603,
  end: 1698
}, {
  title: 'Article 25',
  index: 1699,
  end: 1823
}, {
  title: 'Article 26',
  index: 1824,
  end: 1920
}, {
  title: 'Article 27',
  index: 1921,
  end: 1996
}, {
  title: 'Article 28',
  index: 1997,
  end: 2057
}, {
  title: 'Article 29',
  index: 2058,
  end: 2089
}, {
  title: 'Article 30',
  index: 2090,
  end: 2132
}, {
  title: 'Article 31',
  index: 2133,
  end: 2221 
}, {
  title: 'Article 32',
  index: 2222,
  end: 2354
}, {
  title: 'Article 33',
  index: 2355,
  end: 2403
}, {
  title: 'Article 34',
  index: 2404,
  end: 2465
}];

export default function TableOfContentsPage(): JSX.Element | null {
  const { book, content } = useContext(BookContext);
  const screen = useScreen();
  const { setPage } = useContext(PageContext);
  const theme = useTheme();
  const { setChapterLocation, setCursor } = useBookNavigation();

  const handleChangeChapter = (index: number): void => {
    const startingCursor = articles[index].index;
    nullthrows(setCursor)([startingCursor, undefined]);
    nullthrows(setChapterLocation)([0]);
    setPage(Page.READER);
  };

  if (!book || !content) return null;

  const items = articles.map((article, i) => ({
    key: article.title,
    onPress: () => handleChangeChapter(i),
    ui: <Text>{article.title}</Text>,
  }));

  if (screen === Screen.SM) {
    return (
      <View style={theme.p(4)}>
        <Text align={TextAlign.CENTER} style={[theme.p(4)]}>
          {book.title}
        </Text>
        <List items={items} style={[theme.mt(4)]} />;
      </View>
    );
  }

  return (
    <View style={[theme.flex1, theme.flexRow, theme.p(10)]}>
      <View style={[theme.flex1, theme.pr(5)]}>
        <Image
          resizeMode="contain"
          source={{ uri: `https://storage.googleapis.com/lexome_books/${book.id}/cover.jpg` }}
          style={theme.heightScreen}
        />
      </View>
      <List items={items} style={[theme.flex1, theme.pl(5)]} />
    </View>
  );
}
