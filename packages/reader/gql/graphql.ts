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

export type Author = {
  __typename?: 'Author';
  books: Array<Book>;
  createdAt?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
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
  createdAt: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['String']['output'];
  includedTypes: Array<EnhancementType>;
  subscriptions: Array<Subscription>;
  title: Scalars['String']['output'];
  updateEvents: Array<EnhancementEvent>;
};

export type EnhancementEvent = {
  __typename?: 'EnhancementEvent';
  createdAt: Scalars['String']['output'];
  createdBy: User;
  enhancement: Enhancement;
  id: Scalars['String']['output'];
  operation: Scalars['String']['output'];
  type: EnhancementType;
};

export type EnhancementType = {
  __typename?: 'EnhancementType';
  createdAt: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  enhancementEvents: Array<EnhancementEvent>;
  enhancements: Array<Enhancement>;
  id: Scalars['String']['output'];
  slug: Scalars['String']['output'];
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
  createAuthor?: Maybe<Author>;
  createBook?: Maybe<Book>;
  deleteBook?: Maybe<Book>;
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


export type MutationDeleteBookArgs = {
  id: Scalars['String']['input'];
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

export type Query = {
  __typename?: 'Query';
  getAuthor?: Maybe<Author>;
  getAuthors?: Maybe<AuthorConnection>;
  getBook?: Maybe<Book>;
  getBooks?: Maybe<BookConnection>;
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

export enum Role {
  Admin = 'admin',
  User = 'user'
}

export type Subscription = {
  __typename?: 'Subscription';
  createdAt: Scalars['String']['output'];
  enhancement: Enhancement;
  id: Scalars['String']['output'];
  role: Role;
  user: User;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  enhancementEvents: Array<EnhancementEvent>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  subscriptions: Array<Subscription>;
  verificationCode?: Maybe<Scalars['String']['output']>;
};

export type ListStoryBooksQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  pagination?: InputMaybe<Pagination>;
}>;


export type ListStoryBooksQuery = { __typename?: 'Query', getBooks?: { __typename?: 'BookConnection', pageInfo: { __typename?: 'PageInfo', hasMore: boolean, offset: number }, records: Array<{ __typename?: 'Book', id: string, title: string, coverUrl?: string | null, description?: string | null, authors?: Array<{ __typename?: 'Author', id?: string | null, displayName?: string | null } | null> | null }> } | null };


export const ListStoryBooksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListStoryBooks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBooks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListStoryBooksQuery, ListStoryBooksQueryVariables>;