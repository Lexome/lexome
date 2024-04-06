import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { FaExternalLinkSquareAlt } from '@react-icons/all-files/fa/FaExternalLinkSquareAlt';
// import { FaLink } from '@react-icons/all-files/fa/FaLink';
import { FaWindowClose } from '@react-icons/all-files/fa/FaWindowClose';

// import { Icon, IconName } from '../../components';
import { useEnhancement } from '../../context';
import styled from '../../styled';
import * as theme from '../../theme';

const IconWrapper = styled(View, {
  styles: {
    display: 'flex',
    padding: '10px',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const IconButton = styled(TouchableOpacity, {
  styles: {
    backgroundColor: theme.Color.MEDIUM_BLUE,
    height: '40px',
    width: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
});

const OpenPanelButton = (): JSX.Element => {
  const { isPanelOpen, openPanel, closePanel } = useEnhancement();
  return (
    <IconWrapper>
      <IconButton onPress={isPanelOpen ? closePanel : openPanel}>
        {isPanelOpen ? (
          <FaWindowClose color="white" size={24}/>
        ) : <FaExternalLinkSquareAlt color="white" size={24}/>}
      </IconButton>
    </IconWrapper>
  );
};

const BottomMenuContainer = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
});

const BottomMenu = () => {
  return (
    <BottomMenuContainer>
      {/* <TableOfContents /> */}
      {/* <AnnotationsToggle /> */}
      <OpenPanelButton />
    </BottomMenuContainer>
  );
};

export default BottomMenu;
