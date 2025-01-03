import { STATE_KEY } from "@/constants"
import { useSharedState } from "@/hooks/useSharedState"
import { ReaderFontPreference, ThemeMode, Personalization } from "@lexome/core"

export const Settings = () => {
  const [personalization, setPersonalization] = useSharedState<Personalization>({
    key: STATE_KEY.PERSONALIZATION,
    initialValue: {
      themeMode: ThemeMode.Light,
      readerFontSize: 16,
      readerFontStyle: ReaderFontPreference.Modern,
    }
  })

}
