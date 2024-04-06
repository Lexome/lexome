import { View, Text, TextInput } from 'react-native';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {useQueryClient} from 'react-query';
import { Avatar, Button, TextInput as RnpTextInput, Chip as PaperChip } from 'react-native-paper';
import { FaPaperPlane } from '@react-icons/all-files/fa/FaPaperPlane';

import { useEnhancement, useUser } from '../../../context';
import { Color } from '../../../theme';
import {useEffect, useState } from 'react';
import { DISCUSSION_THREAD_CACHE_KEY, useDiscussionThread } from '../../../hooks/useDiscussionThread';
import { ThreadMessage, addThreadMessage } from '../../../api';
import { useDiscussionTags } from '../../../hooks/useTags';
import { ANONYMOUS_USER_ID, getAuthorName, getNameInitials } from './utils';
import { Panel, PanelContainer, PanelMain, Row } from './components';
import { ThreadListView } from './ThreadListView';
import styled from '../../../styled';
import { ADMIN_LOGIN_ROUTE, GUEST_LOGIN_ROUTE, HOME_ROUTE, THREAD_DETAIL_ROUTE } from '../../../constants';
import { activityMonitor } from '../../../utils';
import { formatTimestamp } from '../util';
import { BoldText } from '../../../components/BoldText';

const DetailTitleRow = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '8px'
  }
})

const DetailTitleAttribution = styled(View, {
  styles: {
    fontSize: 14,
    flexDirection: 'row',
  }
})

const DetailText = styled(Text, {
  styles: {
    fontSize: 18,
    lineHeight: 22,
    color: Color.GRAY_DARK,
  }
})

const ReplyBubbleContainer = styled<{
  mine?: boolean;
}>(View, {
  styles: {
    borderRadius: 16,
    fontSize: 16,
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    marginBottom: '16px',
    maxWidth: '280px'
  },
  computeStyles: ({mine}) => ({
    borderColor: mine ? Color.PRIMARY : Color.GRAY_MEDIUM,
    backgroundColor: mine ? Color.PRIMARY : Color.GRAY_FAINT,
    color: mine ? 'white' : Color.GRAY_DARKEST,
    alignSelf: mine ? 'flex-end' : 'flex-start'
  }),
});

const ReplyBubbleAttribution = styled(Text, {
  styles: {
    marginBottom: '5px',
    fontWeight: '600',
    color: 'inherit',
    fontSize: 'inherit' as any
  },
});

const Column = styled(Text, {
  styles: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '8px',
  }
});

const ReplyBubbleMessage = styled(Text, {
  computeStyles: () => ({
    color: 'inherit',
    fontSize: 'inherit' as any
  })
});

const ReplyBubble: React.FC<{
  mine?: boolean;
  authorName?: string;
  message: string;
}> = ({
  mine,
  authorName,
  message,
}) => (
  <ReplyBubbleContainer mine={mine}>
    {
      authorName &&
      <ReplyBubbleAttribution>
        {authorName}
      </ReplyBubbleAttribution>
    }
    <ReplyBubbleMessage>
      {message}
    </ReplyBubbleMessage>
  </ReplyBubbleContainer>
);


const ReplyList = styled(View, {
  styles: {
    borderRadius: 8,
    fontSize: 16,
    alignItems: 'flex-start',
  },
})

const ReplySectionContainer = styled(View, {
  styles: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTopWidth: 1,
    borderTopColor: Color.GRAY_LIGHT
  },
})

const TimestampRow = styled(View, {
  styles: {
    padding: '8px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '600'
  }
})

const getSortedMessages = (messageObj: {
  [key: string]: ThreadMessage
}) => {
  const messages = Object.values(messageObj);
  messages.sort((message1, message2) => {
    return message1.timestamp > message2.timestamp ? 1 : -1;
  });

  return messages
}


const ReplySection: React.FC<{ id: string }> = ({ id }) => {
  const threadMessagesQuery = useDiscussionThread(id);
  const thread = threadMessagesQuery.data;
  const messages = thread?.messages || {};
  const sortedMessages = getSortedMessages(messages);

  const { user } = useUser();

  let lastTimestamp: string = '';

  return (
    <ReplySectionContainer>
      <ReplyList>
        {sortedMessages && sortedMessages.map((message) => {
          let includeTimestamp = false;
          const timestamp = formatTimestamp(message.timestamp);
          if (lastTimestamp !== timestamp) {
            includeTimestamp = true;
            lastTimestamp = timestamp;
          }

          const authorName = getAuthorName({
            firstName: message.first_name,
            lastName: message.last_name,
          });

          console.log(
            user.id,
            ANONYMOUS_USER_ID,
            message.first_name,
            user.first_name,
            'is mine?'
          );

          const mine = user!.id === ANONYMOUS_USER_ID
            ? (
              message.first_name === user!.first_name &&
              'Anonymous' !== user!.first_name
            )
            : message.user_id === user?.id;

          return (
            <>
              {includeTimestamp && <TimestampRow>{timestamp}</TimestampRow>}
              <ReplyBubble
                authorName={mine ? undefined : authorName}
                message={message.content}
                mine={mine}
              />
            </>
          )
        })}
      </ReplyList>
    </ReplySectionContainer>
  );
};

const MessageFormContainer = styled(View, {
  styles: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
});

const BackButtonRow = styled(Row, {
  styles: {
    marginTop: '16px',
    justifyContent: 'space-between'
  }
});


const ThreadTags = styled(Row, {
  styles: {
    marginBottom: '4px'
  }
})

const ThreadDetailView = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const params = useParams();
  const id = params.id;
  const threadQuery = useDiscussionThread(id || '');
  const [commentField, setCommentField] = useState('');
  const queryClient = useQueryClient();
  const {data: tags} = useDiscussionTags();

  const thread = threadQuery.data;

  const [isSending, setIsSending] = useState(false);

  let tag: any = null;
  if (thread?.tag_id && tags) {
    tag = tags.find(tag => tag.id === thread?.tag_id);
  }

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      if (activityMonitor.isActive) {
        queryClient.refetchQueries(DISCUSSION_THREAD_CACHE_KEY);
      }
    }, 15000);

    return () => {
      clearInterval(refetchInterval);
    }
  });

  const authorName = thread && getAuthorName({
    firstName: thread.first_name,
    lastName: thread.last_name,
  })
  const authorInitials = authorName && getNameInitials(authorName);

  const send = async () => {
    if (commentField && !isSending) {
      setCommentField('');
      setIsSending(true);

      await addThreadMessage({
        userId: user?.id as any,
        firstName: user?.first_name,
        lastName: user?.last_name,
        threadId: id!,
        content: commentField,
        tagLabel: tag?.label
      });

      setIsSending(false);
      queryClient.invalidateQueries(DISCUSSION_THREAD_CACHE_KEY);
    }
  }

  const onBack = () => {
    navigate('/')
  }

  return (
    <PanelContainer>
      <BackButtonRow>
        <Button icon="arrow-left" onPress={onBack}>Back</Button>
      </BackButtonRow>
      <PanelMain>
        {thread && (
          <DetailTitleRow>
            <Avatar.Text label={authorInitials} size={48}/>
            <Column>
              {tag && (
                <ThreadTags>
                  <PaperChip compact textStyle={{fontSize: 11}}>{tag.label}</PaperChip>
                </ThreadTags>
              )}
              <DetailTitleAttribution>
                <BoldText pr>{authorName}</BoldText>
                wrote on
                <BoldText pl>{formatTimestamp(thread?.timestamp)}</BoldText>:
              </DetailTitleAttribution>
            </Column>
          </DetailTitleRow>
        )}
        <DetailText>
          {thread?.content}
        </DetailText>
        <ReplySection id={id} />
        <MessageFormContainer>
          <TextInput
            style={{
              borderColor: Color.GRAY_MEDIUM,
              borderWidth: 1,
              padding: '16px',
              borderRadius: 4,
              width: '100%',
            }}
            value={commentField}
            onChangeText={setCommentField}
            numberOfLines={3}
            multiline
            placeholder='Enter New Comment'
          />
          <FaPaperPlane
            size={36}
            color={!commentField || isSending ? Color.GRAY_MEDIUM : Color.PRIMARY}
            onClick={send}
            style={{
              marginLeft: '8px',
              cursor: commentField ? 'pointer' : 'default'
            }}
          />
        </MessageFormContainer>
      </PanelMain>
    </PanelContainer>
  );
}

const LoginOuter = styled(View, {
  styles: {
    width: '450px',
    backgroundColor: 'white',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: '32px',
    paddingVertical: '32px'
  }
})

const LoginInner = styled(View, {
  styles: {
    width: '285px',
    display: 'flex',
    alignItems: 'center',
  }
})

const Overlay = styled(View, {
  styles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});

const FullPage = styled(View, {
  styles: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const BoldLink = styled(Text, {
  styles: {
    color: Color.PRIMARY,
    fontWeight: '600',
    cursor: 'pointer'
  } as any
});
const ReadOnlyModeLink = styled(BoldLink, {
  styles: {
    marginTop: '12px',
    fontSize: 16
  }
});

const GuestLogInFormWrapper = styled(View, {
  styles: {
    marginTop: '16px',
    width: '285px',
  }
});

const GuestLogInHeading = styled(View, {
  styles: {
    marginBottom: '16px',
    fontWeight: '600',
    lineHeight: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

const GuestLoginView = () => {
  const [nameField, setNameField] = useState('');
  const {signInAsGuest, user} = useUser();
  const {closePanel} = useEnhancement()

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const continueWithName = () => {
    signInAsGuest(nameField);
    navigate('/');
  };

  const continueAsAnonymous = () => {
    signInAsGuest('Anonymous');
    navigate('/');
  };

  const onBack = () => {
    closePanel();
  }

  return (
    <FullPage>
      <Overlay />
      <PanelContainer>
        <LoginOuter>
          <LoginInner>
            <GuestLogInFormWrapper>
              <BackButtonRow>
                <Button icon="arrow-left" onPress={onBack}>Back</Button>
                <Button onPress={() => navigate(ADMIN_LOGIN_ROUTE)}>Admin</Button>
              </BackButtonRow>
              <GuestLogInHeading>
                Enter your name if you want your feedback attributed.
              </GuestLogInHeading>
              <RnpTextInput label="Name" autoComplete={false} value={nameField} onChangeText={setNameField} />
              <Button
                mode="contained"
                style={{marginTop: '16px'}}
                disabled={!nameField}
                onPress={continueWithName}
              >
                Continue {nameField ? `as ${nameField}` : ''}
              </Button>
            </GuestLogInFormWrapper>
            <ReadOnlyModeLink onPress={continueAsAnonymous}>Continue as Anonymous</ReadOnlyModeLink>
          </LoginInner>
        </LoginOuter>
      </PanelContainer>
    </FullPage>
  )
};

const AdminLoginView = () => {
  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const {signInWithEmail, user} = useUser();
  const {closePanel} = useEnhancement()

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const continueWithEmail = async () => {
    const resp = await signInWithEmail({
      email: emailField,
      password: passwordField
    });

    navigate('/');
  };

  const onBack = () => {
    closePanel();
  }

  return (
    <FullPage>
      <Overlay />
      <PanelContainer>
        <LoginOuter>
          <LoginInner>
            <GuestLogInFormWrapper>
              <BackButtonRow>
                <Button icon="arrow-left" onPress={onBack}>Back</Button>
              </BackButtonRow>
              <RnpTextInput
                label="Email"
                autoComplete={false}
                value={emailField}
                onChangeText={setEmailField}
              />
              <RnpTextInput
                label="Password"
                autoComplete={false}
                value={passwordField}
                onChangeText={setPasswordField}
                secureTextEntry
              />

              <Button
                mode="contained"
                style={{marginTop: '16px'}}
                disabled={!emailField || !passwordField}
                onPress={continueWithEmail}
              >
                Sign In
              </Button>
            </GuestLogInFormWrapper>
          </LoginInner>
        </LoginOuter>
      </PanelContainer>
    </FullPage>
  )
};

export const EnhancementPanel = () => {
  const {isPanelOpen} = useEnhancement();

  useDiscussionTags();

  if (!isPanelOpen) {
    return null;
  } else {
    return (
      <Panel>
        <Routes>
          <Route path={HOME_ROUTE} element={<ThreadListView />} />
          <Route path={GUEST_LOGIN_ROUTE} element={<GuestLoginView />} />
          <Route path={ADMIN_LOGIN_ROUTE} element={<AdminLoginView />} />
          <Route path={THREAD_DETAIL_ROUTE} element={<ThreadDetailView />} />
        </Routes>
      </Panel>
    );
  }
};
