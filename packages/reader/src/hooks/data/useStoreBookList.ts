import { useQuery } from "@tanstack/react-query"
import { graphql } from "../../../gql"
import request from "graphql-request"

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

export const useStoreBookList = () => {
  return useQuery({
    queryKey: [STORE_BOOK_LIST],
    queryFn: async () => {
      return request({
        document: listStoreBooksQuery,
        url: GRAPHQL_ENDPOINT,
        variables: {
          query: '',
          pagination: {
            limit: 10,
            offset: 0,
          },
        },
      })
    },
  })
}