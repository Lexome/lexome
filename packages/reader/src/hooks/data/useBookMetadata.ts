import request from "graphql-request";
import { graphql } from "../../../gql";
import { GRAPHQL_ENDPOINT } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "../useQueryParams";

const bookMetadataQuery = graphql(`
  query GetBookMetadata($id: String!) {
    getBook(id: $id) {
      hashIndex
    }
  }
`)

export const useBookMetadata = () => {
  const { bookId } = useQueryParams()

  return useQuery({
    queryKey: ['bookMetadata', bookId],
    queryFn: async () => {
      if (!bookId) return null

      const data = await request({
        document: bookMetadataQuery, 
        url: GRAPHQL_ENDPOINT,
        variables: {
          id: bookId
        }
      })

      if (!data.getBook) return null

      if (data.getBook.hashIndex) {
        const parsedHashIndex = JSON.parse(data.getBook.hashIndex)
        data.getBook.hashIndex = parsedHashIndex
      } else {
        (data.getBook as any).hashIndex = []
      }

      return data.getBook
    }
  })
}