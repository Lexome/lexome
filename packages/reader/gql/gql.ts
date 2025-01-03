/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetAuthenticatedUser {\n    getAuthenticatedUser {\n      id\n      email\n    }\n  }\n": types.GetAuthenticatedUserDocument,
    "\nquery GetBookAsset($id: String!) {\n  getBook(id: $id) {\n    assetUrl\n  }\n}\n": types.GetBookAssetDocument,
    "\n  query GetBookMetadata($id: String!) {\n    getBook(id: $id) {\n      hashIndex\n    }\n  }\n": types.GetBookMetadataDocument,
    "\n  mutation CreateEnhancement(\n    $title: String!,\n    $bookId: String!,\n    $includedTypes: [EnhancementType!]!,\n    $isDefault: Boolean\n  ) {\n    createEnhancement(\n      title: $title,\n      bookId: $bookId,\n      isDefault: $isDefault,\n      includedTypes: $includedTypes\n    ) {\n      id\n      title\n      includedTypes\n      isDefault\n    }\n  }\n": types.CreateEnhancementDocument,
    "\nmutation BeginEmailLoginMutation($email: String!) {\n  beginEmailLogIn(email: $email) {\n    success\n  }\n}\n": types.BeginEmailLoginMutationDocument,
    "\nmutation CompleteEmailLoginMutation($email: String!, $verificationCode: String!) {\n  completeEmailLogIn(email: $email, verificationCode: $verificationCode) {\n    success\n    jwt\n  }\n}\n": types.CompleteEmailLoginMutationDocument,
    "\n  mutation LogInWithGoogle($token: String!) {\n    logInWithGoogle(googleAccessToken: $token) {\n      jwt\n    }\n  }\n": types.LogInWithGoogleDocument,
    "\n  mutation UpdatePersonalization(\n    $themeMode: ThemeMode,\n    $readerFontSize: Int,\n    $readerFontStyle: ReaderFontPreference\n  ) {\n    updatePersonalization(\n      themeMode: $themeMode,\n      readerFontSize: $readerFontSize,\n      readerFontStyle: $readerFontStyle\n    ) {\n      success\n    }\n  }\n": types.UpdatePersonalizationDocument,
    "\nquery ListStoryBooks($query: String, $pagination: Pagination) {\n  getBooks(query: $query, pagination: $pagination) {\n    pageInfo {\n      hasMore\n      offset\n    }\n    records {\n      id\n      title\n      coverUrl\n      description\n      authors {\n        id\n        displayName\n      }\n    }\n  }\n}\n": types.ListStoryBooksDocument,
    "\n  query GetEnhancements($bookId: String!) {\n    getSubscribedEnhancementsForBook(bookId: $bookId) {\n      coalescedData\n      includedTypes\n      id\n      isDefault\n    }\n  }\n": types.GetEnhancementsDocument,
    "\nquery GetUserCollection {\n  getUserCollection {\n    id\n    books {\n      id\n      title\n      coverUrl\n      description\n      authors {\n        id\n        displayName\n      }\n    }\n  }\n}\n": types.GetUserCollectionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAuthenticatedUser {\n    getAuthenticatedUser {\n      id\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetAuthenticatedUser {\n    getAuthenticatedUser {\n      id\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetBookAsset($id: String!) {\n  getBook(id: $id) {\n    assetUrl\n  }\n}\n"): (typeof documents)["\nquery GetBookAsset($id: String!) {\n  getBook(id: $id) {\n    assetUrl\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBookMetadata($id: String!) {\n    getBook(id: $id) {\n      hashIndex\n    }\n  }\n"): (typeof documents)["\n  query GetBookMetadata($id: String!) {\n    getBook(id: $id) {\n      hashIndex\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEnhancement(\n    $title: String!,\n    $bookId: String!,\n    $includedTypes: [EnhancementType!]!,\n    $isDefault: Boolean\n  ) {\n    createEnhancement(\n      title: $title,\n      bookId: $bookId,\n      isDefault: $isDefault,\n      includedTypes: $includedTypes\n    ) {\n      id\n      title\n      includedTypes\n      isDefault\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEnhancement(\n    $title: String!,\n    $bookId: String!,\n    $includedTypes: [EnhancementType!]!,\n    $isDefault: Boolean\n  ) {\n    createEnhancement(\n      title: $title,\n      bookId: $bookId,\n      isDefault: $isDefault,\n      includedTypes: $includedTypes\n    ) {\n      id\n      title\n      includedTypes\n      isDefault\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation BeginEmailLoginMutation($email: String!) {\n  beginEmailLogIn(email: $email) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation BeginEmailLoginMutation($email: String!) {\n  beginEmailLogIn(email: $email) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CompleteEmailLoginMutation($email: String!, $verificationCode: String!) {\n  completeEmailLogIn(email: $email, verificationCode: $verificationCode) {\n    success\n    jwt\n  }\n}\n"): (typeof documents)["\nmutation CompleteEmailLoginMutation($email: String!, $verificationCode: String!) {\n  completeEmailLogIn(email: $email, verificationCode: $verificationCode) {\n    success\n    jwt\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogInWithGoogle($token: String!) {\n    logInWithGoogle(googleAccessToken: $token) {\n      jwt\n    }\n  }\n"): (typeof documents)["\n  mutation LogInWithGoogle($token: String!) {\n    logInWithGoogle(googleAccessToken: $token) {\n      jwt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePersonalization(\n    $themeMode: ThemeMode,\n    $readerFontSize: Int,\n    $readerFontStyle: ReaderFontPreference\n  ) {\n    updatePersonalization(\n      themeMode: $themeMode,\n      readerFontSize: $readerFontSize,\n      readerFontStyle: $readerFontStyle\n    ) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePersonalization(\n    $themeMode: ThemeMode,\n    $readerFontSize: Int,\n    $readerFontStyle: ReaderFontPreference\n  ) {\n    updatePersonalization(\n      themeMode: $themeMode,\n      readerFontSize: $readerFontSize,\n      readerFontStyle: $readerFontStyle\n    ) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListStoryBooks($query: String, $pagination: Pagination) {\n  getBooks(query: $query, pagination: $pagination) {\n    pageInfo {\n      hasMore\n      offset\n    }\n    records {\n      id\n      title\n      coverUrl\n      description\n      authors {\n        id\n        displayName\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery ListStoryBooks($query: String, $pagination: Pagination) {\n  getBooks(query: $query, pagination: $pagination) {\n    pageInfo {\n      hasMore\n      offset\n    }\n    records {\n      id\n      title\n      coverUrl\n      description\n      authors {\n        id\n        displayName\n      }\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEnhancements($bookId: String!) {\n    getSubscribedEnhancementsForBook(bookId: $bookId) {\n      coalescedData\n      includedTypes\n      id\n      isDefault\n    }\n  }\n"): (typeof documents)["\n  query GetEnhancements($bookId: String!) {\n    getSubscribedEnhancementsForBook(bookId: $bookId) {\n      coalescedData\n      includedTypes\n      id\n      isDefault\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetUserCollection {\n  getUserCollection {\n    id\n    books {\n      id\n      title\n      coverUrl\n      description\n      authors {\n        id\n        displayName\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetUserCollection {\n  getUserCollection {\n    id\n    books {\n      id\n      title\n      coverUrl\n      description\n      authors {\n        id\n        displayName\n      }\n    }\n  }\n}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;