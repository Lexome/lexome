import { View, Text } from "react-native";
import { FaUserCircle } from '@react-icons/all-files/fa/FaUserCircle';

import styled from "../../../styled";
import { Color } from "../../../theme";
import { Dropdown } from "../../../components";
import { getAuthorName, getNameInitials } from "./utils";
import { useEnhancement, useUser } from "../../../context";
import { Screen, useScreen, useTheme } from '../../../hooks';
import { FaWindowClose } from "@react-icons/all-files/fa/FaWindowClose";

export const Row = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  }
});

export const ScrollBar = styled<{
  h: string
}>(View, {
  styles: {
    overflow: 'auto' as any,
    width: '100%'
  },
  computeStyles: ({h}) => ({
    maxHeight: h
  })
})

export const Panel = styled(View, {
  styles: {
    display: 'flex',
    alignItems: 'stretch',
    height: '100%',

    color: 'rgb(80, 80, 80)',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  computeStyles: (_, theme) => {
    const isFullWidth = (
      theme.screen === Screen.SM ||
      theme.screen === Screen.MS ||
      theme.screen === Screen.MD
    );
    return {
      width: theme.panelWidth,
      position: isFullWidth ? 'absolute' : 'relative',
      borderLeftColor: isFullWidth ? undefined : 'rgb(200,200,200)',
      borderLeftWidth: isFullWidth ? 0 : 1,
    };
  }
});

export const PanelTopBar = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  }
});

export const PanelMain = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 0,
    fontSize: 20,
    lineHeight: 24,
    marginTop: '16px',
  },
})

export const PanelContainer = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    flexGrow: 1
  },
  computeStyles: (_, theme) => ({
    padding: (theme.screen === Screen.SM) ? '16px' : '32px'
  })
});

export const CloseButton = () => {
  const {closePanel} = useEnhancement()
  return (
    <FaWindowClose
      size={40}
      color={Color.PRIMARY}
      onClick={closePanel}
      style={{
        marginLeft: '16px',
        cursor: 'pointer'
      }}
    />
  );
}

export const LexomeAvatar = () => {
  const {user, signOut} = useUser();
  const theme = useTheme();

  if (!user) {
    return (
      <FaUserCircle
        size={40}
        color={Color.PRIMARY}
        style={{
          marginLeft: '16px'
        }}
      />
    )
  } else {
    const name = getAuthorName({
      firstName: user.first_name,
      lastName: user.last_name,
      user: {
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
    const initials = getNameInitials(name);

    return (
      <Dropdown
        trigger={(
          <FaUserCircle
            size={40}
            color={Color.PRIMARY}
            style={{
              marginLeft: '16px'
            }}
          />
          // <Avatar.Text label={initials} size={48} style={{
          //   marginLeft: '16px'
          // }}/>
        )}
      >
        {({ closeDropdown }) => (
          <View>
            <Text
              // color={theme.Color.DARK}
              numberOfLines={1}
              onPress={() => {
                closeDropdown();
                signOut();
              }}
              style={[theme.ph(6), theme.pv(3)]}
            >
              Sign Out
            </Text>
          </View>
        )}
      </Dropdown>
    );
  }
};

export const RightMenu = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems:'center'
  }
});

export const AddRow = styled(Row, {
  styles: {
    marginTop: '16px',
    justifyContent: 'center'
  }
});

export const AddThreadHeading = styled(Text, {
  styles: {
    fontWeight: '600',
    fontSize: 20,
    color: Color.GRAY_DARK
  }
});

export const SelectTagRow = styled(Row, {
  styles: {
    marginTop: '12px',
    alignItems: 'center'
  }
});

export const Label = styled(View, {
  styles: {
    marginRight: '16px',
  }
});

export const LabelText = styled(View, {
  styles: {
    fontWeight: '600',
    fontSize: 18,
    color: Color.GRAY_DARK
  }
});

export const InputRow = styled(Row, {
  styles: {
    marginTop: '12px'
  }
});

export const ButtonRow = styled(Row, {
  styles: {
    marginTop: '16px',
    justifyContent: 'flex-end'
  }
})