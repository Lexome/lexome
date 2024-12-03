import { useMutation } from "@tanstack/react-query"
import { graphql } from "../../../gql"
import request from "graphql-request"
import { GRAPHQL_ENDPOINT } from "@/config"
import { useJwt } from "../useAuth"
import { CompleteEmailLoginMutationMutation } from "../../../gql/graphql"

const beginEmailLoginMutation = graphql(`
mutation BeginEmailLoginMutation($email: String!) {
  beginEmailLogIn(email: $email) {
    success
  }
}
`)

const completeEmailLoginMutation = graphql(`
mutation CompleteEmailLoginMutation($email: String!, $verificationCode: String!) {
  completeEmailLogIn(email: $email, verificationCode: $verificationCode) {
    success
    jwt
  }
}
`)

export const useLogInWithEmail = () => {
  return useMutation({
    mutationFn: (email: string) => request(GRAPHQL_ENDPOINT, beginEmailLoginMutation, { email })
  })
}

export const useCompleteEmailLogin = () => {
  const [,setJwt] = useJwt()

  return useMutation<
    CompleteEmailLoginMutationMutation,
    unknown,
    { email: string; code: string }
  >({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const response = await request(
        GRAPHQL_ENDPOINT,
        completeEmailLoginMutation,
        { email, verificationCode: code }
      )

      if (response.completeEmailLogIn?.success) {
        setJwt(response.completeEmailLogIn.jwt)
      }

      return response
    }
  })
}
