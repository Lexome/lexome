import { useMutation } from "@tanstack/react-query";
import { graphql } from "../../../gql"
import request from "graphql-request";
import { MutationCreateEnhancementArgs } from "../../../gql/graphql";
import { GRAPHQL_ENDPOINT } from "@/config";

const createEnhancementQuery = graphql(`
  mutation CreateEnhancement(
    $title: String!,
    $bookId: String!,
    $includedTypes: [EnhancementType!]!,
    $isDefault: Boolean
  ) {
    createEnhancement(
      title: $title,
      bookId: $bookId,
      isDefault: $isDefault,
      includedTypes: $includedTypes
    ) {
      id
      title
      includedTypes
      isDefault
    }
  }
`)

export const useCreateEnhancement = () => {
  const createEnhancement = useMutation({
    mutationFn: (variables: MutationCreateEnhancementArgs) => {
      return request({
        url: GRAPHQL_ENDPOINT,
        document: createEnhancementQuery,
        variables
      })
    },
  });
  return createEnhancement;
};
