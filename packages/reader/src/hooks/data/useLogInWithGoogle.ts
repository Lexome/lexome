import { GRAPHQL_ENDPOINT } from "@/config"
import { graphql } from "../../../gql"
import { useMutation } from "@tanstack/react-query"
import request from "graphql-request"

const logInWithGoogleMutation = graphql(`
  mutation LogInWithGoogle($token: String!) {
    logInWithGoogle(googleAccessToken: $token) {
      jwt
    }
  }
`)

export const useLogInWithGoogle = () => {
  return useMutation({
    mutationFn: (token: string) => request(
      GRAPHQL_ENDPOINT,
      logInWithGoogleMutation,
      { token }
    )
  })
}
