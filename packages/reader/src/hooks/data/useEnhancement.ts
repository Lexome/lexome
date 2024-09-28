import request from "graphql-request"
import { graphql } from "../../../gql"
import { GRAPHQL_ENDPOINT } from "@/config"

const enhancementQuery = graphql(`
  query getEnhancement($id: ID!) {
    getEnhancement(id: $id) {
      id
      title
      description
      url
    }
  }
`)

export const useEnhancement = (id: string) => {
  // return useQuery({
  //   queryKey: ['enhancement', id],
  //   queryFn: async () => {
  //     const data = await request({
  //       document: enhancementQuery,
  //       url: GRAPHQL_ENDPOINT,
  //       variables: { id }
  //     })
  //   }
  // })
}