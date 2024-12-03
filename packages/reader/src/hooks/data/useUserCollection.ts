import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

import { GRAPHQL_ENDPOINT } from "@/config";

import { graphql } from "../../../gql/gql";
import { useAuthHeaders } from "../useAuth";
import { STATE_KEY } from "@/constants";
import { useSharedState } from "../useSharedState";

const getUserCollectionQuery = graphql(`
query GetUserCollection {
  getUserCollection {
    id
    books {
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

export const useUserCollection = () => {
  const authHeaders = useAuthHeaders()
  return useQuery({
    queryKey: ['getUserCollection'],
    queryFn: async () => {
      return await request(GRAPHQL_ENDPOINT, getUserCollectionQuery, {}, authHeaders)
    }
  })
}

