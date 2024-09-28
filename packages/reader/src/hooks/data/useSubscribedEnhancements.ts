import request from "graphql-request"
import { graphql } from "../../../gql"
import { GRAPHQL_ENDPOINT } from "@/config"
import { useQuery } from "@tanstack/react-query"

const subscribedEnhancementsQuery = graphql(`
  query GetEnhancements($bookId: String!) {
    getSubscribedEnhancementsForBook(bookId: $bookId) {
      coalescedData
    }
  }
`)

const SUBSCRIBED_ENHANCEMENTS_QUERY_KEY = 'subscribed-enhancements'

export const useSubscribedEnhancements = (params: {
  bookId: string
}) => {
  const { bookId } = params

  if (!bookId) {
    return {
      data: undefined
    }
  }

  return useQuery({
    queryKey: [SUBSCRIBED_ENHANCEMENTS_QUERY_KEY, bookId],
    queryFn: async () => {
      const data = await request({
        document: subscribedEnhancementsQuery,
        url: GRAPHQL_ENDPOINT,
        variables: { bookId }
      })

      return data
    }
  })
}