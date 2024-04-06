import React, { Fragment, useContext } from 'react';
import { View } from 'react-native';

import { Icon, IconName } from '../../components';
import { ModalPage, PageContext, useBookNavigation, useEnhancement } from '../../context';
import { Screen, useScreen, useTheme } from '../../hooks';
import styled from '../../styled';
import * as theme from '../../theme';
import Content from './Content';
import { EnhancementPanel } from './EnhancementPanel';
import NavBar from './NavBar';
import TableOfContents from './TableOfContents';

const ContainerContents = styled<{
  useAbsolutePosition: boolean;
}>(View, {
  computeStyles: ({ useAbsolutePosition }, theme) => ({
    height: '100%',
    flexGrow: useAbsolutePosition ? 0 : 1,
    padding: '24px',
    width: theme.contentWidth,
  }),
});

const CollapsingContent = styled(View, {
  styles: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    position: 'relative',
  },
});

const ContainerWrapper = styled(View, {
  styles: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    fontFamily: 'helvetica',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const MainColumn = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const ShrinkingPadding = styled(View, {
  styles: {
    flexShrink: 1,
    height: '100%',
  },
  computeStyles: (_, { screen }) => ({
    width: screen === Screen.LG ? '48px' : '32px',
  }),
});

const Padding = styled(View, {
  styles: {
    flexShrink: 0,
    height: '100%',
  },
  computeStyles: (_, { screen }) => ({
    width: screen === Screen.LG ? '24px' : '16px',
  }),
});

const Container: React.FC = () => {
  const { modal } = useContext(PageContext);
  const { chapterLocation, goToNextPage, goToPreviousPage } = useBookNavigation();
  const { isPanelOpen } = useEnhancement();
  const screen = useScreen();

  const useAbsolutePosition = screen === Screen.XL || screen === Screen['2XL'] || !isPanelOpen;

  return (
    <ContainerWrapper>
      <CollapsingContent>
        {modal === ModalPage.TABLE_OF_CONTENTS ? (
          <TableOfContents />
        ) : (
          <Fragment>
            {!useAbsolutePosition && <ShrinkingPadding />}
            <ContainerContents
              useAbsolutePosition={useAbsolutePosition}>
              <MainColumn>
                <Content />
                <NavBar />
              </MainColumn>
            </ContainerContents>
            {!useAbsolutePosition && <Padding />}
          </Fragment>
        )}
      </CollapsingContent>
      <EnhancementPanel />
    </ContainerWrapper>
  );
};

export default Container;
