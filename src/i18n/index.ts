import { en } from './en'
import { nl } from './nl'
import { it } from './it'
import type { Lang, Translation } from './types'

export const translations: Record<Lang, Translation> = { en, nl, it }

export { LANGS, LANG_LABELS } from './types'
export type { Lang, Translation } from './types'
