import request from "graphql-request";
import { graphql } from "../../../gql";
import { GRAPHQL_ENDPOINT } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "../useQueryParams";
import { HashIndex } from "@lexome/core";
import { GetBookMetadataQuery } from "../../../gql/graphql";

const bookMetadataQuery = graphql(`
  query GetBookMetadata($id: String!) {
    getBook(id: $id) {
      hashIndex
    }
  }
`)

type BookMetadata = Omit<GetBookMetadataQuery['getBook'], 'hashIndex'> & {
  hashIndex: HashIndex
}

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

      const bookMetadata = data.getBook as unknown as BookMetadata

      if (data.getBook.hashIndex) {
        const parsedHashIndex = JSON.parse(data.getBook.hashIndex) as HashIndex
        bookMetadata.hashIndex = parsedHashIndex
      } else {
        bookMetadata.hashIndex = {
          prefixHashOrdering: {},
          suffixHashOrdering: {},
          hashArray: []
        }
      }

      return bookMetadata
    }
  })
}