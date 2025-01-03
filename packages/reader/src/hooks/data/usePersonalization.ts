import { STATE_KEY } from "@/constants"
import { useSharedState } from "../useSharedState"
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthData } from "../useAuth"
import { Personalization, ReaderFontPreference, ThemeMode } from "@lexome/core"
import { useEffect } from "react"
import request, { gql } from "graphql-request"
import { GRAPHQL_ENDPOINT } from "@/config"

const queryKey = 'personalization'

const updatePersonalizationMutation = gql`
  mutation UpdatePersonalization(
    $themeMode: ThemeMode,
    $readerFontSize: Int,
    $readerFontStyle: ReaderFontPreference
  ) {
    updatePersonalization(
      themeMode: $themeMode,
      readerFontSize: $readerFontSize,
      readerFontStyle: $readerFontStyle
    ) {
      success
    }
  }
`

export const usePersonalization = () => {
  const authData = useAuthData()

  const [personalization, _setPersonalization] = useSharedState<Personalization>({
    key: STATE_KEY.PERSONALIZATION,
    initialValue: {
      themeMode: ThemeMode.Light,
      readerFontSize: 16,
      readerFontStyle: ReaderFontPreference.Modern,
    }
  })

  const updatePersonalization = useMutation({
    mutationFn: (personalization: Personalization) => {
      return request({
        document: updatePersonalizationMutation,
        url: GRAPHQL_ENDPOINT,
        variables: {
          readerFontSize: personalization.readerFontSize,
          themeMode: personalization.themeMode,
          readerFontStyle: personalization.readerFontStyle,
        }
      })
    }
  })

  const setPersonalization = (personalization: Personalization) => {
    _setPersonalization(personalization)
    if (authData.data) {
      updatePersonalization.mutate(personalization)
    }
  }

  const setFontStyle = (fontStyle: ReaderFontPreference) => {
    setPersonalization({
      ...personalization,
      readerFontStyle: fontStyle
    })
  }

  const setFontSize = (fontSize: number) => {
    setPersonalization({
      ...personalization,
      readerFontSize: fontSize
    })
  }

  const setThemeMode = (themeMode: ThemeMode) => {
    setPersonalization({
      ...personalization,
      themeMode: themeMode
    })
  } 

  const { data: loadedPersonalization } = useQuery({
    queryKey: [queryKey, authData?.data?.id],
    queryFn: () => {
      if (!authData.data) {
        return null
      }
    }
  })

  useEffect(() => {
    if (loadedPersonalization) {
      setPersonalization(loadedPersonalization)
    }
  }, [loadedPersonalization])

  return {
    personalization,
    setFontStyle,
    setFontSize,
    setThemeMode
  }
}