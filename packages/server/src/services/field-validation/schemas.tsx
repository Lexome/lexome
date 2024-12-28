import z from 'zod'
import { READER_FONT_PREFERENCE } from '../../sharedValues'


export const personalizationSchema = z.object({
  themeMode: z.string(),
  readerFontPreference: z.enum([
    READER_FONT_PREFERENCE.SOFT_SERIF,
    READER_FONT_PREFERENCE.CLASSIC_SERIF,
    READER_FONT_PREFERENCE.MODERN
  ]),
})