import z from 'zod'
import { ReaderFontPreference } from '../../generated/graphql'

export const personalizationSchema = z.object({
  themeMode: z.string(),
  readerFontPreference: z.enum([
    ReaderFontPreference.SOFT_SERIF,
    ReaderFontPreference.CLASSIC_SERIF,
    ReaderFontPreference.MODERN
  ]),
})