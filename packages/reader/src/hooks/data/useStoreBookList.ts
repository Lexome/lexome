import { useQuery } from "@tanstack/react-query"
import { graphql } from "../../../gql"
import request from "graphql-request"
import { GRAPHQL_ENDPOINT } from "@/config"
import { ListStoryBooksQuery } from "../../../gql/graphql"

const STORE_BOOK_LIST = 'store_book_list'

const listStoreBooksQuery = graphql(`
query ListStoryBooks($query: String, $pagination: Pagination) {
  getBooks(query: $query, pagination: $pagination) {
    pageInfo {
      hasMore
      offset
    }
    records {
      id
      title
      coverUrl
      description
      authors {
        id
        displayName
      }
    }
  }
}
`)

export type CollectionBook = NonNullable<NonNullable<ListStoryBooksQuery['getBooks']>['records']>[0]

export const useStoreBookList = (params: {
  query?: string,
  pagination?: {
    offset?: number
  }
}) => {
  return useQuery({
    queryKey: [STORE_BOOK_LIST, params.query],
    queryFn: async () => {
      try {
        const response = await request({
          document: listStoreBooksQuery,
          url: GRAPHQL_ENDPOINT,
          variables: {
            query: params.query,
            pagination: {
              limit: 20,
              offset: params.pagination?.offset || 0,
            },
          },
        })
        return response
      } catch (e) {
        console.error(e)
      }

      return null
    },
  })
}