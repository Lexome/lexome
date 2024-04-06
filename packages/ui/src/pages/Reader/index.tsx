import React, { useEffect } from 'react';
import {useQueryClient} from 'react-query';

import { AnnotationLocationsProvider } from '../../context/annotations/AnnotationLocationsContext';
import { EnhancementProvider } from '../../context/enhancement/EnhancementContext';
import { EnhancementLibraryProvider } from '../../context/enhancement/EnhancementLibraryContent';
import { DISCUSSION_LIST_CACHE_KEY } from '../../hooks/useDiscussionList';
import Container from './Container';

export default function Reader(): JSX.Element {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries(DISCUSSION_LIST_CACHE_KEY);
    }, 30000);

    return () => {
      clearInterval(interval);
    }
  },[]);
  return (
    <AnnotationLocationsProvider>
      <EnhancementProvider>
        <EnhancementLibraryProvider>
          <Container />
        </EnhancementLibraryProvider>
      </EnhancementProvider>
    </AnnotationLocationsProvider>
  );
}
