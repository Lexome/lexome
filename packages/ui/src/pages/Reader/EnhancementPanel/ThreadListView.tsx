import { Pressable, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import { Avatar, Button, Chip as PaperChip} from 'react-native-paper';
import { useQueryClient } from 'react-query';

import styled from "../../../styled";
import { Color } from '../../../theme';
import { ButtonRow, CloseButton, InputRow, Label, LabelText, LexomeAvatar, PanelContainer, PanelMain, PanelTopBar, RightMenu, Row, ScrollBar, SelectTagRow } from './components';
import { useNavigate } from 'react-router-dom';
import { ANONYMOUS_USER_ID, getAuthorName, getNameInitials } from './utils';
import { useDiscussionTags } from '../../../hooks/useTags';
import { truncateChapter, useBookNavigation, useEnhancement, useUser } from '../../../context';
import { useEffect, useMemo, useState } from 'react';
import { useDiscussionFilters } from '../../../context/DiscussionFilters';
import { DISCUSSION_LIST_CACHE_KEY, useDiscussionList } from '../../../hooks/useDiscussionList';
import { addThread } from '../../../api';
import { articles } from '../TableOfContents';
import { GUEST_LOGIN_ROUTE } from '../../../constants';
import { Paragraph } from '@lexome/core';
import { activityMonitor } from '../../../utils';
import { formatTimestamp } from '../util';
import { BoldText } from '../../../components/BoldText';
import { useDeleteThread } from '../../../hooks/useDeleteThread';

const ThreadItemAttribution = styled(View, {
  styles: {
    fontSize: 14,
    flexDirection: 'row',
    marginTop: '4px'
  }
});



const IconsRow = styled(View, {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '4px',
    width: '80px'
  }
});

const ThreadItemContainer = styled<{last: boolean}>(Pressable as any, {
  styles: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '16px',
    paddingTop: '16px',
    cursor: 'pointer',
  } as any,
  computeStyles: ({ last }) => ({
    borderBottomColor: !last ? Color.GRAY_LIGHT : undefined,
    borderBottomWidth: !last ? 1 : 0,
  }) 
});

const ThreadItemRight = styled(View, {
  styles: {
    flexGrow: 1,
    flexShrink: 1,
  }
});

const ThreadItemLeft = styled(View, {
  styles: {
    flexGrow: 0,
    flexBasis: '110px',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export const ThreadTags = styled(Row);

const ThreadIconWrapper = styled(TouchableOpacity, {
  styles: {
    fontSize: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const ThreadItemActionWrapper = styled(View, {
  styles: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

const ThreadIcon: React.FC<{
  icon: 'comments' | 'upvotes';
  count: number;
  onPress: () => void;
}> = ({
  icon,
  count,
  onPress
}) => {
  const props = {
    size: 16,
    color: Color.GRAY_MEDIUM,
    style: {
      marginRight: '4px'
    }
  }
  return (
    <ThreadIconWrapper>
      {icon === 'comments' ? (
        <FaComment {...props} onClick={onPress}/>
      ) : null}
      <Text onPress={onPress}>{count}</Text>
    </ThreadIconWrapper>
  )
}

const ThreadListItem: React.FC<{
  id: number,
  last: boolean,
  message: string,
  name: string,
  replyCount: number,
  timestamp: string,
  tagId?: string
}> = ({id, last, message, replyCount, tagId, name, timestamp}) => {
  const navigate = useNavigate();
  const {user} = useUser();
  const initials = getNameInitials(name);
  const {data: tags} = useDiscussionTags();
  const {
    deleteThread,
    isDeleting,
  } = useDeleteThread()

  let tag = null;
  if (tagId && tags) {
    tag = tags.find(tag => tag.id === tagId);
  }

  const goToThread = () => {
    navigate(`/thread/${id}`);
  }
  return (
    <ThreadItemContainer last={last} onPress={goToThread}>
      <ThreadItemLeft>
        <Avatar.Text label={initials} size={48}/>
        <IconsRow>
          <ThreadIcon icon="comments" count={replyCount} onPress={goToThread} />
        </IconsRow>
      </ThreadItemLeft>
      <ThreadItemRight>
        {tag && (
          <ThreadTags>
            <PaperChip compact textStyle={{fontSize: 11}}>{tag.label}</PaperChip>
          </ThreadTags>
        )}
        <ThreadItemAttribution>
          <BoldText pr>{name}</BoldText>
          wrote on
          <BoldText pl>{timestamp}</BoldText>:
        </ThreadItemAttribution>
        <Text numberOfLines={2}>
          {message}
        </Text>

      </ThreadItemRight>
      <ThreadItemActionWrapper>
        <Button onPress={goToThread}>
          Reply
        </Button>
        {user?.isAdmin &&
          <Button onPress={() => deleteThread(id)} textColor='red' disabled={isDeleting}>
            Delete
          </Button>}
      </ThreadItemActionWrapper>    
      
    </ThreadItemContainer>
  )
}

const OtherCommentsHeading = styled(Text, {
  styles: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.GRAY_DARK
  }
});

const OtherCommentsHeadingRow = styled(Row, {
  styles: {
    marginTop: '20px',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const getCommentHeader = (tag: {
  id: number,
  label: string
}) => {
  if (!tag) {
    return 'All comments';
  } else if (tag.label === 'General') {
    return 'Other General Comments';
  } else if (tag.label === 'New Article Idea') {
    return 'Other New Article Ideas'
  } else {
    return `Other ${tag.label} Comments`
  }
}

const EmptyMessage = styled(View, {
  styles: {
    marginTop: '16px'
  }
})

const ExcerptParagraph = styled(View, {
  styles: {
    marginRight: '4px',
    marginTop: '4px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})

const Word = styled<{b: boolean}>(Text, {
  styles: {
    marginRight: '4px',
    fontSize: 16,
    display: 'inline' as any
  },
  computeStyles: ({b}) => ({
    fontWeight: b ? 600 : 400
  })
})

const BackButtonRow = styled(View, {
  styles: {
    marginTop: '16px',
    justifyContent: 'space-between',
    display: 'flex'
  }
});

export const ThreadListView = () => {
  const navigate = useNavigate();
  const {closePanel} = useEnhancement()
  const {data: tags} = useDiscussionTags();
  const {fullChapter: chapter} = useBookNavigation()
  const {user} = useUser();
  const [submitting, setSubmitting] = useState(false);
  const {
    tagFilter,
    setTagFilter,
  } = useDiscussionFilters();
  const {data} = useDiscussionList();
  const [message, setMessage] = useState<string>('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      if (activityMonitor.isActive) {
        queryClient.refetchQueries(DISCUSSION_LIST_CACHE_KEY);
      }
    }, 15000);

    return () => {
      clearInterval(refetchInterval);
    }
  });

  useEffect(() => { 
    if (!user) {
      navigate(GUEST_LOGIN_ROUTE);
    }
  }, [user]);

  const tag = useMemo(() => {
    return tags && tags.find(tag => tag.id === tagFilter);
  }, [tags, tagFilter]);

  const tagLabel = tag?.label;

  const getAnchorBoundsFromTag = (tagLabel: string) => {
    const article = articles.find(article => article.title === tagLabel);
    if (article) {
      const anchorStart = article?.index;
      const anchorEnd = article?.end;
      return [anchorStart, anchorEnd];
    } else {
      return undefined
    }
  }

  const excerpt = useMemo(() => {
    if (tag?.label && chapter) {
      const bounds = getAnchorBoundsFromTag(tag.label);
      if (bounds) {
        return truncateChapter({
          chapter,
          lowerRenderLimit: bounds[0],
          upperRenderLimit: bounds[1]
        });
      }
    }
  }, [tag, chapter])

  const submit = async () => {
    // let anchorStart;
    // let anchorEnd;

    // if (tag && (tag.label.includes('Article') || tag.label === 'Preamble')) {
    //   const anchorBounds =  getAnchorBoundsFromTag(tag.label);
    //   if (anchorBounds) {
    //     anchorStart = anchorBounds[0];
    //     anchorEnd = anchorBounds[1];
    //   }
    // }

    setSubmitting(true);

    await addThread({
      userId: user!.id,
      content: message,
      tagId: tagFilter === '' ? undefined : tagFilter,
      tagLabel: tagLabel,
      firstName: user?.first_name || 'Anonymous',
      lastName: user?.last_name,
    });

    setSubmitting(false);
    setMessage('');

    queryClient.refetchQueries(DISCUSSION_LIST_CACHE_KEY);
  }

  let tagList = [{
    id: '',
    label: 'Select Tag'
  }];

  if (tags) {
    tagList = tagList.concat(tags);
  }

  let otherCommentsHeader = 'All Comments';

  if (tags && tagFilter) {
    otherCommentsHeader = getCommentHeader(tags.find((tag) => 
      tag.id === tagFilter
    ));
  }

  const threads = data ? data : [];

  const getThreadsSection = () => {
    if (!threads) {
      return null;
    }

    if (threads.length > 0) {
      return threads.map((thread, i) => {
        const name = getAuthorName({
          firstName: thread.first_name,
          lastName: thread.last_name,
        })

        return (
          <ThreadListItem
            id={thread.id}
            name={name}
            message={thread.content}
            replyCount={Object.keys(thread.messages).length || 0}
            tagId={thread.tag_id}
            last={i === threads.length - 1}
            timestamp={formatTimestamp(thread.timestamp)}
          />
        );
      })
    } else {
      return (
        <EmptyMessage>
          No comments found.
        </EmptyMessage>
      );
    }
  }

  const viewAllComments = () => {
    setTagFilter('');
  }



  return (
    <PanelContainer>
      <PanelTopBar>
        <BackButtonRow>
          <Button icon="arrow-left" onPress={closePanel}>Back</Button>
        </BackButtonRow>
        <RightMenu>
          <LexomeAvatar />
          <CloseButton />
        </RightMenu>
      </PanelTopBar>
      <PanelMain>
        <SelectTagRow>
          <Label>
            <LabelText>Tag:</LabelText>
          </Label>
          <Picker
            prompt="Select Tag"
            selectedValue={tagFilter}
            style={{
              padding: '8px',
              fontSize: 14
            }}
            onValueChange={(value)=> {
              setTagFilter(value.toString());
            }}
          >
            {tagList.map((tag) => (
              <Picker.Item label={tag.label} value={tag.id} />
            ))}
          </Picker>
        </SelectTagRow>
        <InputRow>
          <TextInput
            style={{
              borderColor: Color.GRAY_MEDIUM,
              borderWidth: 1,
              padding: '16px',
              borderRadius: 4,
              width: '100%'
            }}
            numberOfLines={10}
            multiline
            value={message}
            onChangeText={setMessage}
            placeholder='Enter New Comment'
          />
        </InputRow>
        <ButtonRow>
          <Button
            mode="contained"
            disabled={submitting || !tagFilter || !message}
            onPress={submit}
          >
            Submit Comment
          </Button>
        </ButtonRow>
        <View>
          {excerpt && (
            excerpt.content.map((p, i) => {
              const paragraph = p as Paragraph;
              return (
                <ExcerptParagraph>
                  {paragraph.text.map((textSection) => (
                    textSection.text.map(word => (
                      <Word b={i===0}>{word}</Word>
                    ))
                  ))}
                </ExcerptParagraph>
              );
            })
          )}
        </View>
        <OtherCommentsHeadingRow>
          <OtherCommentsHeading>
            {otherCommentsHeader}
          </OtherCommentsHeading>
          {tagFilter ? (
            <Button onPress={viewAllComments}>
              View All Comments
            </Button>
          ) : null}
        </OtherCommentsHeadingRow>
        {getThreadsSection()}
      </PanelMain>
    </PanelContainer>
  );
}