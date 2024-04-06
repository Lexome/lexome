import {useQuery} from 'react-query';
import { getTags } from '../api';

export const useDiscussionTags = () => {
  const keys = ['DISCUSSION_TAGS'];

  return useQuery(keys, async () => {
    const response = await getTags();
    return response;
  });
};