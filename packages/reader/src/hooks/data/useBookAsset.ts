import { useQuery } from "@tanstack/react-query"
import { graphql } from "../../../gql"
import request from "graphql-request"
import { GRAPHQL_ENDPOINT } from "@/config"
import { useQueryParams } from "../useQueryParams"

const bookAssetQuery = graphql(`
query GetBookAsset($id: String!) {
  getBook(id: $id) {
    assetUrl
  }
}
`)

export const useBookAsset = () => {
  const { bookId } = useQueryParams()

  return useQuery({
    queryKey: ['bookAsset', bookId],
    queryFn: async () => {
      console.log('book id', bookId)

      if (!bookId) return null

      const data = await request({
        document: bookAssetQuery, 
        url: GRAPHQL_ENDPOINT,
        variables: { id: bookId }
      })

      return data.getBook?.assetUrl
    }
  })
}