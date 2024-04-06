import "core-js";
import "regenerator-runtime/runtime";
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { registerRootComponent } from 'expo';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {
  QueryClient,
  QueryClientProvider
} from 'react-query';

import {
  BookProvider,
  BookNavigationProvider,
  OverlayProvider,
  PageProvider,
  // pageToComponent,
  SearchProvider,
  UserProvider,
} from './context';
import { Color } from './theme';
import { DiscussionFiltersProvider } from './context/DiscussionFilters';
import Reader from './pages/Reader';
import { useQueryParams } from './hooks/useQueryParams';

const queryClient = new QueryClient();

// function Content(): JSX.Element {
//   return <Reader />createElement(pageToComponent[Page.READER])
// }

// function wrapWithProvider<ComponentProps=any> (params: {
//   C: React.FC<ComponentProps>,
//   content: JSX.Element,
//   props: ComponentProps
// }): JSX.Element {
//   const {C, content, props} = params;
//   return (
//     <C {...props}>
//       {content}
//     </C>
//   );
// };

// const ContextProviders = [
//   [QueryClientProvider, {client: queryClient}],
//   [MemoryRouter, {initialEntries: '/'}],
//   [BookProvider],
//   [BookNavigationProvider],
//   [OverlayProvider],
//   [PageProvider],
//   [SearchProvider],
//   [UserProvider],
//   [DiscussionFiltersProvider]
// ]

export default function App(): JSX.Element | null {
  const {panelRoute} = useQueryParams()

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[panelRoute || '/']}>
        <BookProvider>
          <BookNavigationProvider>
            <OverlayProvider>
              <PageProvider>
                <SearchProvider>
                  <UserProvider>
                    <DiscussionFiltersProvider>
                      <PaperProvider theme={{
                        ...DefaultTheme,
                        colors: {
                          ...DefaultTheme.colors,
                          primary: Color.PRIMARY,
                          secondary: Color.PRIMARY,
                          secondaryContainer: Color.BLUE_FAINT,
                          onSecondaryContainer: Color.BLUE_DARK,
                          tertiary: Color.BLUE_LIGHT,
                          surfaceVariant: Color.OFF_WHITE,
                          onSurfaceVariant: Color.BLUE_DARK,
                        }
                      }}>
                        <Reader />
                      </PaperProvider>
                    </DiscussionFiltersProvider>
                  </UserProvider>
                </SearchProvider>
              </PageProvider>
            </OverlayProvider>
          </BookNavigationProvider>
        </BookProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

registerRootComponent(App);
