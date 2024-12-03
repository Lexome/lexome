import "@typespec/rest";
import "@typespec/http";

namespace BookService;

using TypeSpec.Rest;
using TypeSpec.Http;

@doc("Role types for subscriptions")
enum Role {
  admin,
  user,
}

@doc("Types of enhancements that can be applied to books")
enum EnhancementType {
  summary,
  notes,
  narration,
}

@doc("Filters for querying books")
model BookFilters {
  authors?: string[];
  genres?: string[];
}

@doc("Pagination parameters")
model Pagination {
  limit?: int32;
  offset?: int32;
}

@doc("Page information for paginated responses")
model PageInfo {
  offset: int32;
  hasMore: boolean;
}

@doc("Authentication response")
model AuthResponse {
  jwt: string;
  success: boolean;
}

@doc("Phone login response")
model PhoneLogInResponse {
  success: boolean;
}

@doc("User model")
model User {
  id: string;
  createdAt: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
  phone?: string;
  email?: string;
  verificationCode?: string;
  enhancementPatches: EnhancementPatch[];
  subscriptions: Subscription[];
}

@doc("Author model")
model Author {
  id: string;
  createdAt?: string;
  user?: User;
  displayName: string;
  books: Book[];
}

@doc("Author connection for pagination")
model AuthorConnection {
  records: Author[];
  pageInfo: PageInfo;
}

@doc("Book model")
model Book {
  id: string;
  createdAt: string;
  title: string;
  description?: string;
  coverUrl?: string;
  assetUrl?: string;
  authors?: Author[];
  enhancements?: Enhancement[];
  genres?: Genre[];
  hashIndex?: string;
}

@doc("User collection model")
model UserCollection {
  id: string;
  books: Book[];
  user: User;
}

@doc("Book connection for pagination")
model BookConnection {
  records: Book[];
  pageInfo: PageInfo;
}

@doc("Genre model")
model Genre {
  id: string;
  createdAt: string;
  name: string;
  books?: Book[];
}

@doc("Enhancement model")
model Enhancement {
  id: string;
  createdAt: string;
  title: string;
  book: Book;
  includedTypes: EnhancementType[];
  subscriptions: Subscription[];
  coalescedData: string;
  coalescedTimestamp: string;
  patches: EnhancementPatch[];
  isDefault?: boolean;
}

@doc("Subscription model")
model Subscription {
  id: string;
  createdAt: string;
  user: User;
  enhancement: Enhancement;
  role: Role;
}

@doc("Enhancement patch model")
model EnhancementPatch {
  id: string;
  createdAt: string;
  operation: string;
  createdBy?: User;
  type: EnhancementType;
}

@doc("Input for creating a book")
model CreateBookInput {
  title: string;
  description?: string;
  coverUrl?: string;
  assetUrl?: string;
  authors?: string[];
  genres?: string[];
}

@doc("Input for creating an author")
model CreateAuthorInput {
  userId?: string;
  displayName: string;
  bookIds?: string[];
}

@doc("Input for creating an enhancement")
model CreateEnhancementInput {
  title: string;
  bookId: string;
  includedTypes: EnhancementType[];
  isDefault?: boolean;
}

@route("/books")
@doc("Operations for managing books")
interface BookOperations {
  @get
  getBooks(
    @query query?: string,
    @query filters?: BookFilters,
    @query pagination?: Pagination
  ): BookConnection;

  @get("/{id}")
  getBook(@path id: string): Book;

  @post
  createBook(@body input: CreateBookInput): Book;

  @delete("/{id}")
  deleteBook(@path id: string): Book;
}

@route("/authors")
@doc("Operations for managing authors")
interface AuthorOperations {
  @get
  getAuthors(
    @query query?: string,
    @query pagination?: Pagination
  ): AuthorConnection;

  @get("/{id}")
  getAuthor(@path id: string): Author;

  @post
  createAuthor(@body input: CreateAuthorInput): Author;
}

@route("/enhancements")
@doc("Operations for managing enhancements")
interface EnhancementOperations {
  @get("/book/{bookId}")
  getEnhancementsForBook(@path bookId: string): Enhancement[];

  @get("/subscribed/book/{bookId}")
  getSubscribedEnhancementsForBook(@path bookId: string): Enhancement[];

  @post
  createEnhancement(@body input: CreateEnhancementInput): Enhancement;
}

@route("/subscriptions")
@doc("Operations for managing subscriptions")
interface SubscriptionOperations {
  @get
  getSubscriptions(@query bookId?: string): Enhancement[];

  @post
  createSubscription(
    @query enhancementId: string,
    @query role?: Role
  ): Subscription;
}

@route("/auth")
@doc("Authentication operations")
interface AuthOperations {
  @post("/google/login")
  logInWithGoogle(@query googleAccessToken: string): AuthResponse;

  @post("/google/signup")
  createUserWithGoogle(@query googleAccessToken: string): AuthResponse;

  @post("/phone/begin")
  beginPhoneLogIn(@query phoneNumber: string): PhoneLogInResponse;

  @post("/phone/complete")
  completePhoneLogIn(
    @query phoneNumber: string,
    @query verificationCode: string
  ): AuthResponse;
}

@route("/users")
@doc("User operations")
interface UserOperations {
  @get("/me")
  getAuthenticatedUser(): User;
}

@route("/collections")
@doc("Collection operations")
interface CollectionOperations {
  @get("/books")
  getBooksInCollection(): Book[];

  @post
  createUserCollection(): UserCollection;

  @post("/books/{bookId}")
  addBookToUserCollection(@path bookId: string): UserCollection;

  @delete("/books/{bookId}")
  removeBookFromUserCollection(@path bookId: string): UserCollection;
}