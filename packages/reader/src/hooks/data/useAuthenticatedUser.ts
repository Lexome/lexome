import { graphql } from "../../../gql"
import { GRAPHQL_ENDPOINT } from "@/config"
import request from "graphql-request"
import { useAuthHeaders } from "../useAuth"

const getAuthenticatedUserQuery = graphql(`
  query GetAuthenticatedUser {
    getAuthenticatedUser {
      id
      email
      personalization
    }
  }
`)

// Pulls jwt from 
export const useAuthenticatedUser = async () => {
  const headers = useAuthHeaders()

  return await request(GRAPHQL_ENDPOINT, getAuthenticatedUserQuery, {}, headers)
}