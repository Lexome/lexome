import { STATE_KEY } from "@/constants"
import { useSharedState } from "../useSharedState"
import { THEME_MODE } from "@/theme"
import { useQuery } from '@tanstack/react-query'
import { useAuthData } from "../useAuth"

const queryKey = 'personalization'

export const usePersonalization = () => {
  const authData = useAuthData()

  const localSettings = useSharedState({
    key: STATE_KEY.PERSONALIZATION,
    shouldSaveToStorage: true,
    initialValue: {
      themeMode: THEME_MODE.LIGHT
    }
  })


  useQuery({
    queryKey: [queryKey, authData?.data?.id],
    queryFn: () => {
      if (authData.data) {
        return authData.data.personalization
      }
      localSettings,
  })
}