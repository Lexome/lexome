import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FaArrowAltCircleRight } from '@react-icons/all-files/fa/FaArrowAltCircleRight';
import { FaArrowAltCircleLeft } from '@react-icons/all-files/fa/FaArrowAltCircleLeft';


import { useBookNavigation } from '../../context';

import styled from '../../styled';
import * as theme from '../../theme';
import BottomMenu from './BottomMenu';

const NavBarWrapper = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
  computeStyles: (_, theme) => ({
    marginTop: theme.contentPadding + 12
  })
});

const CenterNav = styled(View, {
  styles: {
    paddingLeft: '24px',
    paddingRight: '24px',
    justifyContent: 'center'
  },
});

export default function NavBar(): JSX.Element {
  const { goToNextPage, goToPreviousPage, cursor } = useBookNavigation();

  const showBack = Boolean(cursor && cursor[0]);
  const showNext = Boolean(cursor && cursor[1] !== 2465);

  return (
    <NavBarWrapper>
      <TouchableOpacity onPress={showBack ? goToPreviousPage : undefined} style={{width: '32px'}}>
        {showBack ? (
          <FaArrowAltCircleLeft
            size={32}
            color={theme.Color.MEDIUM_BLUE}
          />
        ) : undefined}
      </TouchableOpacity>
      <CenterNav>
        <BottomMenu /> 
      </CenterNav>
      <TouchableOpacity onPress={showNext ? goToNextPage : undefined} style={{width: '32px'}}>
        {
          showNext ? (
            <FaArrowAltCircleRight
              size={32}
              color={theme.Color.MEDIUM_BLUE}
            />
          ) : null
        }

      </TouchableOpacity>
    </NavBarWrapper>
  );
}
