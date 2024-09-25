import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  Summary = 'summary'
}

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
  createEnhancement?: Maybe<Enhancement>;
  createSubscription?: Maybe<Subscription>;
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


export type MutationCreateEnhancementArgs = {
  bookId: Scalars['String']['input'];
  includedTypes: Array<EnhancementType>;
  title: Scalars['String']['input'];
};


export type MutationCreateSubscriptionArgs = {
  enhancementId: Scalars['String']['input'];
  role?: InputMaybe<Role>;
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
  getEnhancementsForBook: Array<Enhancement>;
  getSubscribedEnhancementsForBook: Array<Enhancement>;
  getSubscriptions: Array<Enhancement>;
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
  enhancementPatches: Array<EnhancementPatch>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  subscriptions: Array<Subscription>;
  verificationCode?: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Author: ResolverTypeWrapper<Author>;
  AuthorConnection: ResolverTypeWrapper<AuthorConnection>;
  Book: ResolverTypeWrapper<Book>;
  BookConnection: ResolverTypeWrapper<BookConnection>;
  BookFilters: BookFilters;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Enhancement: ResolverTypeWrapper<Enhancement>;
  EnhancementPatch: ResolverTypeWrapper<EnhancementPatch>;
  EnhancementType: EnhancementType;
  Genre: ResolverTypeWrapper<Genre>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Pagination: Pagination;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Author: Author;
  AuthorConnection: AuthorConnection;
  Book: Book;
  BookConnection: BookConnection;
  BookFilters: BookFilters;
  Boolean: Scalars['Boolean']['output'];
  Enhancement: Enhancement;
  EnhancementPatch: EnhancementPatch;
  Genre: Genre;
  Int: Scalars['Int']['output'];
  Mutation: {};
  PageInfo: PageInfo;
  Pagination: Pagination;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  User: User;
};

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = {
  books?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthorConnection'] = ResolversParentTypes['AuthorConnection']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  records?: Resolver<Array<ResolversTypes['Author']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  assetUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  authors?: Resolver<Maybe<Array<Maybe<ResolversTypes['Author']>>>, ParentType, ContextType>;
  coverUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  enhancements?: Resolver<Maybe<Array<Maybe<ResolversTypes['Enhancement']>>>, ParentType, ContextType>;
  genres?: Resolver<Maybe<Array<Maybe<ResolversTypes['Genre']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookConnection'] = ResolversParentTypes['BookConnection']> = {
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  records?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnhancementResolvers<ContextType = any, ParentType extends ResolversParentTypes['Enhancement'] = ResolversParentTypes['Enhancement']> = {
  book?: Resolver<ResolversTypes['Book'], ParentType, ContextType>;
  coalescedData?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coalescedTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  includedTypes?: Resolver<Array<ResolversTypes['EnhancementType']>, ParentType, ContextType>;
  patches?: Resolver<Array<ResolversTypes['EnhancementPatch']>, ParentType, ContextType>;
  subscriptions?: Resolver<Array<ResolversTypes['Subscription']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnhancementPatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnhancementPatch'] = ResolversParentTypes['EnhancementPatch']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  operation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['EnhancementType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Genre'] = ResolversParentTypes['Genre']> = {
  books?: Resolver<Maybe<Array<Maybe<ResolversTypes['Book']>>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationCreateAuthorArgs, 'displayName'>>;
  createBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationCreateBookArgs, 'title'>>;
  createEnhancement?: Resolver<Maybe<ResolversTypes['Enhancement']>, ParentType, ContextType, RequireFields<MutationCreateEnhancementArgs, 'bookId' | 'includedTypes' | 'title'>>;
  createSubscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType, RequireFields<MutationCreateSubscriptionArgs, 'enhancementId'>>;
  deleteBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationDeleteBookArgs, 'id'>>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<QueryGetAuthorArgs, 'id'>>;
  getAuthors?: Resolver<Maybe<ResolversTypes['AuthorConnection']>, ParentType, ContextType, Partial<QueryGetAuthorsArgs>>;
  getBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<QueryGetBookArgs, 'id'>>;
  getBooks?: Resolver<Maybe<ResolversTypes['BookConnection']>, ParentType, ContextType, Partial<QueryGetBooksArgs>>;
  getEnhancementsForBook?: Resolver<Array<ResolversTypes['Enhancement']>, ParentType, ContextType, RequireFields<QueryGetEnhancementsForBookArgs, 'bookId'>>;
  getSubscribedEnhancementsForBook?: Resolver<Array<ResolversTypes['Enhancement']>, ParentType, ContextType, RequireFields<QueryGetSubscribedEnhancementsForBookArgs, 'bookId'>>;
  getSubscriptions?: Resolver<Array<ResolversTypes['Enhancement']>, ParentType, ContextType, Partial<QueryGetSubscriptionsArgs>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  createdAt?: SubscriptionResolver<ResolversTypes['String'], "createdAt", ParentType, ContextType>;
  enhancement?: SubscriptionResolver<ResolversTypes['Enhancement'], "enhancement", ParentType, ContextType>;
  id?: SubscriptionResolver<ResolversTypes['String'], "id", ParentType, ContextType>;
  role?: SubscriptionResolver<ResolversTypes['Role'], "role", ParentType, ContextType>;
  user?: SubscriptionResolver<ResolversTypes['User'], "user", ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enhancementPatches?: Resolver<Array<ResolversTypes['EnhancementPatch']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profilePicture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subscriptions?: Resolver<Array<ResolversTypes['Subscription']>, ParentType, ContextType>;
  verificationCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Author?: AuthorResolvers<ContextType>;
  AuthorConnection?: AuthorConnectionResolvers<ContextType>;
  Book?: BookResolvers<ContextType>;
  BookConnection?: BookConnectionResolvers<ContextType>;
  Enhancement?: EnhancementResolvers<ContextType>;
  EnhancementPatch?: EnhancementPatchResolvers<ContextType>;
  Genre?: GenreResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

