import z from 'zod'
import { ReaderFontPreference } from '../../generated/graphql'

export const personalizationSchema = z.object({
  themeMode: z.string(),
  readerFontPreference: z.enum([
    ReaderFontPreference.SoftSerif,
    ReaderFontPreference.ClassicSerif,
    ReaderFontPreference.Modern
  ]),
  readerFontSize: z.number().min(12).max(24),
})

export type Personalization = z.infer<typeof personalizationSchema>
