/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  jwt: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Author = {
  __typename?: 'Author';
  books: Array<Book>;
  createdAt?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type AuthorConnection = {
  __typename?: 'AuthorConnection';
  pageInfo: PageInfo;
  records: Array<Author>;
};

export type Book = {
  __typename?: 'Book';
  assetUrl?: Maybe<Scalars['String']['output']>;
  authors?: Maybe<Array<Maybe<Author>>>;
  coverUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enhancements?: Maybe<Array<Maybe<Enhancement>>>;
  genres?: Maybe<Array<Maybe<Genre>>>;
  hashIndex?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type BookConnection = {
  __typename?: 'BookConnection';
  pageInfo: PageInfo;
  records: Array<Book>;
};

export type BookFilters = {
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  genres?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Enhancement = {
  __typename?: 'Enhancement';
  book: Book;
  coalescedData: Scalars['String']['output'];
  coalescedTimestamp: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  includedTypes: Array<EnhancementType>;
  isDefault?: Maybe<Scalars['Boolean']['output']>;
  patches: Array<EnhancementPatch>;
  subscriptions: Array<Subscription>;
  title: Scalars['String']['output'];
};

export type EnhancementPatch = {
  __typename?: 'EnhancementPatch';
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<User>;
  id: Scalars['String']['output'];
  operation: Scalars['String']['output'];
  type: EnhancementType;
};

export enum EnhancementType {
  Narration = 'NARRATION',
  Notes = 'NOTES',
  Summary = 'SUMMARY'
}

export type GenericSuccessResponse = {
  __typename?: 'GenericSuccessResponse';
  success: Scalars['Boolean']['output'];
};

export type Genre = {
  __typename?: 'Genre';
  books?: Maybe<Array<Maybe<Book>>>;
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookToUserCollection?: Maybe<UserCollection>;
  beginEmailLogIn?: Maybe<GenericSuccessResponse>;
  completeEmailLogIn?: Maybe<AuthResponse>;
  createAuthor?: Maybe<Author>;
  createBook?: Maybe<Book>;
  createEnhancement?: Maybe<Enhancement>;
  createSubscription?: Maybe<Subscription>;
  createUserCollection?: Maybe<UserCollection>;
  createUserWithGoogle?: Maybe<AuthResponse>;
  deleteBook?: Maybe<Book>;
  logInWithGoogle?: Maybe<AuthResponse>;
  removeBookFromUserCollection?: Maybe<UserCollection>;
  shareEnhancement?: Maybe<GenericSuccessResponse>;
  updatePersonalization?: Maybe<GenericSuccessResponse>;
};


export type MutationAddBookToUserCollectionArgs = {
  bookId: Scalars['String']['input'];
};


export type MutationBeginEmailLogInArgs = {
  email: Scalars['String']['input'];
};


export type MutationCompleteEmailLogInArgs = {
  email: Scalars['String']['input'];
  verificationCode: Scalars['String']['input'];
};


export type MutationCreateAuthorArgs = {
  bookIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  displayName: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateBookArgs = {
  assetUrl?: InputMaybe<Scalars['String']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  coverUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  genres?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title: Scalars['String']['input'];
};


export type MutationCreateEnhancementArgs = {
  bookId: Scalars['String']['input'];
  includedTypes: Array<EnhancementType>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
};


export type MutationCreateSubscriptionArgs = {
  enhancementId: Scalars['String']['input'];
  role?: InputMaybe<Role>;
};


export type MutationCreateUserWithGoogleArgs = {
  googleAccessToken: Scalars['String']['input'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['String']['input'];
};


export type MutationLogInWithGoogleArgs = {
  googleAccessToken: Scalars['String']['input'];
};


export type MutationRemoveBookFromUserCollectionArgs = {
  bookId: Scalars['String']['input'];
};


export type MutationShareEnhancementArgs = {
  enhancementId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationUpdatePersonalizationArgs = {
  readerFontSize?: InputMaybe<Scalars['Int']['input']>;
  readerFontStyle?: InputMaybe<ReaderFontPreference>;
  themeMode?: InputMaybe<ThemeMode>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasMore: Scalars['Boolean']['output'];
  offset: Scalars['Int']['output'];
};

export type Pagination = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Personalization = {
  __typename?: 'Personalization';
  readerFontSize?: Maybe<Scalars['Int']['output']>;
  readerFontStyle?: Maybe<ReaderFontPreference>;
  themeMode?: Maybe<ThemeMode>;
};

export type Query = {
  __typename?: 'Query';
  getAuthenticatedUser: User;
  getAuthor?: Maybe<Author>;
  getAuthors?: Maybe<AuthorConnection>;
  getBook?: Maybe<Book>;
  getBooks?: Maybe<BookConnection>;
  getBooksInCollection: Array<Book>;
  getEnhancementsForBook: Array<Enhancement>;
  getSubscribedEnhancementsForBook: Array<Enhancement>;
  getSubscriptions: Array<Enhancement>;
  getUserCollection?: Maybe<UserCollection>;
};


export type QueryGetAuthorArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAuthorsArgs = {
  pagination?: InputMaybe<Pagination>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetBookArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetBooksArgs = {
  filters?: InputMaybe<BookFilters>;
  pagination?: InputMaybe<Pagination>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetEnhancementsForBookArgs = {
  bookId: Scalars['String']['input'];
};


export type QueryGetSubscribedEnhancementsForBookArgs = {
  bookId: Scalars['String']['input'];
};


export type QueryGetSubscriptionsArgs = {
  bookId?: InputMaybe<Scalars['String']['input']>;
};

export enum ReaderFontPreference {
  ClassicSerif = 'CLASSIC_SERIF',
  Modern = 'MODERN',
  SoftSerif = 'SOFT_SERIF'
}

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Subscription = {
  __typename?: 'Subscription';
  createdAt: Scalars['String']['output'];
  enhancement: Enhancement;
  id: Scalars['String']['output'];
  role: Role;
  user: User;
};

export enum ThemeMode {
  Dark = 'DARK',
  Light = 'LIGHT',
  System = 'SYSTEM'
}

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  enhancementPatches: Array<EnhancementPatch>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  personalization?: Maybe<Personalization>;
  phone?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  subscriptions: Array<Subscription>;
  verificationCode?: Maybe<Scalars['String']['output']>;
};

export type UserCollection = {
  __typename?: 'UserCollection';
  books: Array<Book>;
  id: Scalars['String']['output'];
  user: User;
};

export type GetAuthenticatedUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthenticatedUserQuery = { __typename?: 'Query', getAuthenticatedUser: { __typename?: 'User', id: string, email?: string | null } };

export type GetBookAssetQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetBookAssetQuery = { __typename?: 'Query', getBook?: { __typename?: 'Book', assetUrl?: string | null } | null };

export type GetBookMetadataQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetBookMetadataQuery = { __typename?: 'Query', getBook?: { __typename?: 'Book', hashIndex?: string | null } | null };

export type CreateEnhancementMutationVariables = Exact<{
  title: Scalars['String']['input'];
  bookId: Scalars['String']['input'];
  includedTypes: Array<EnhancementType> | EnhancementType;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateEnhancementMutation = { __typename?: 'Mutation', createEnhancement?: { __typename?: 'Enhancement', id: string, title: string, includedTypes: Array<EnhancementType>, isDefault?: boolean | null } | null };

export type BeginEmailLoginMutationMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type BeginEmailLoginMutationMutation = { __typename?: 'Mutation', beginEmailLogIn?: { __typename?: 'GenericSuccessResponse', success: boolean } | null };

export type CompleteEmailLoginMutationMutationVariables = Exact<{
  email: Scalars['String']['input'];
  verificationCode: Scalars['String']['input'];
}>;


export type CompleteEmailLoginMutationMutation = { __typename?: 'Mutation', completeEmailLogIn?: { __typename?: 'AuthResponse', success: boolean, jwt: string } | null };

export type LogInWithGoogleMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type LogInWithGoogleMutation = { __typename?: 'Mutation', logInWithGoogle?: { __typename?: 'AuthResponse', jwt: string } | null };

export type UpdatePersonalizationMutationVariables = Exact<{
  themeMode?: InputMaybe<ThemeMode>;
  readerFontSize?: InputMaybe<Scalars['Int']['input']>;
  readerFontStyle?: InputMaybe<ReaderFontPreference>;
}>;


export type UpdatePersonalizationMutation = { __typename?: 'Mutation', updatePersonalization?: { __typename?: 'GenericSuccessResponse', success: boolean } | null };

export type ListStoryBooksQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<Pagination>;
}>;


export type ListStoryBooksQuery = { __typename?: 'Query', getBooks?: { __typename?: 'BookConnection', pageInfo: { __typename?: 'PageInfo', hasMore: boolean, offset: number }, records: Array<{ __typename?: 'Book', id: string, title: string, coverUrl?: string | null, description?: string | null, authors?: Array<{ __typename?: 'Author', id: string, displayName?: string | null } | null> | null }> } | null };

export type GetEnhancementsQueryVariables = Exact<{
  bookId: Scalars['String']['input'];
}>;


export type GetEnhancementsQuery = { __typename?: 'Query', getSubscribedEnhancementsForBook: Array<{ __typename?: 'Enhancement', coalescedData: string, includedTypes: Array<EnhancementType>, id: string, isDefault?: boolean | null }> };

export type GetUserCollectionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserCollectionQuery = { __typename?: 'Query', getUserCollection?: { __typename?: 'UserCollection', id: string, books: Array<{ __typename?: 'Book', id: string, title: string, coverUrl?: string | null, description?: string | null, authors?: Array<{ __typename?: 'Author', id: string, displayName?: string | null } | null> | null }> } | null };


export const GetAuthenticatedUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuthenticatedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAuthenticatedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetAuthenticatedUserQuery, GetAuthenticatedUserQueryVariables>;
export const GetBookAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBookAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBook"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assetUrl"}}]}}]}}]} as unknown as DocumentNode<GetBookAssetQuery, GetBookAssetQueryVariables>;
export const GetBookMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBookMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBook"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hashIndex"}}]}}]}}]} as unknown as DocumentNode<GetBookMetadataQuery, GetBookMetadataQueryVariables>;
export const CreateEnhancementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEnhancement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includedTypes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnhancementType"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDefault"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEnhancement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"bookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"isDefault"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDefault"}}},{"kind":"Argument","name":{"kind":"Name","value":"includedTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includedTypes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"includedTypes"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]} as unknown as DocumentNode<CreateEnhancementMutation, CreateEnhancementMutationVariables>;
export const BeginEmailLoginMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BeginEmailLoginMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beginEmailLogIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<BeginEmailLoginMutationMutation, BeginEmailLoginMutationMutationVariables>;
export const CompleteEmailLoginMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteEmailLoginMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verificationCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeEmailLogIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"verificationCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verificationCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]} as unknown as DocumentNode<CompleteEmailLoginMutationMutation, CompleteEmailLoginMutationMutationVariables>;
export const LogInWithGoogleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogInWithGoogle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logInWithGoogle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"googleAccessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jwt"}}]}}]}}]} as unknown as DocumentNode<LogInWithGoogleMutation, LogInWithGoogleMutationVariables>;
export const UpdatePersonalizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePersonalization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"themeMode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ThemeMode"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"readerFontSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"readerFontStyle"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ReaderFontPreference"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePersonalization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"themeMode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"themeMode"}}},{"kind":"Argument","name":{"kind":"Name","value":"readerFontSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"readerFontSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"readerFontStyle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"readerFontStyle"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdatePersonalizationMutation, UpdatePersonalizationMutationVariables>;
export const ListStoryBooksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListStoryBooks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBooks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListStoryBooksQuery, ListStoryBooksQueryVariables>;
export const GetEnhancementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEnhancements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSubscribedEnhancementsForBook"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coalescedData"}},{"kind":"Field","name":{"kind":"Name","value":"includedTypes"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]} as unknown as DocumentNode<GetEnhancementsQuery, GetEnhancementsQueryVariables>;
export const GetUserCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserCollectionQuery, GetUserCollectionQueryVariables>;