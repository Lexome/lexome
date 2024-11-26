import request from "graphql-request"
import { graphql } from "../../../gql"
import { GRAPHQL_ENDPOINT } from "@/config"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useBook } from "@/providers/BookProvider"
import { useQueryParams } from "../useQueryParams"
import { EnhancementType } from "@lexome/core"
import { useCreateEnhancement } from "./useCreateEnhancement"
import { useEffect } from "react"

const subscribedEnhancementsQuery = graphql(`
  query GetEnhancements($bookId: String!) {
    getSubscribedEnhancementsForBook(bookId: $bookId) {
      coalescedData
      includedTypes
      id
      isDefault
    }
  }
`)

const SUBSCRIBED_ENHANCEMENTS_QUERY_KEY = 'subscribed-enhancements'

export const useSubscribedEnhancements = () => {
  const { bookId } = useQueryParams()

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

export const useGenerateDefaultDiscussionEnhancement = () => {
  // const { bookId } = useQueryParams()
  // const createEnhancement = useCreateEnhancement()
  // const queryClient = useQueryClient()

  // if (!bookId) {
  //   return {
  //     data: undefined
  //   }
  // }

  const { data } = useSubscribedEnhancements()

  // if (!data) {
  //   return {
  //     data: undefined
  //   }
  // }

  const enhancements = data?.getSubscribedEnhancementsForBook

  const privateNotesEnhancement = enhancements?.find((enhancement) =>
    enhancement.includedTypes.includes(EnhancementType.Notes) &&
    enhancement.isDefault
  )

  useEffect(() => {
    if (!privateNotesEnhancement) {
      createEnhancement.mutate({
        title: 'Private Notes',
        bookId,
        includedTypes: [EnhancementType.Notes],
        isDefault: true
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [SUBSCRIBED_ENHANCEMENTS_QUERY_KEY, bookId] })
        }
      })
    }
  }, [privateNotesEnhancement, createEnhancement])


  return privateNotesEnhancement
}
