// Разбор совета сменить модель или усилие в конце ответа Claude.

export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max'

export type Advice = {
  /** Аргумент для /model: алиас семейства. */
  model?: string
  /** Аргумент для /effort. */
  effort?: Effort
}

// Совет ищется только в последних строках блока: там его ставят правила профиля.
const TAIL_LINES = 3

// Слова, по которым строка читается как совет, а не как рассказ о моделях.
const CUE =
  /(предлага|хватил|хватит|достаточно|переключ|смени|сменить|перейди|перейти|лучше\s+взять|switch|suggest|would\s+do|enough|recommend)/i

// «Модель и усилие подходят» — совета нет.
const FITS = /(модель\s+и\s+усилие\s+подходят|model\s+and\s+effort\s+(are\s+)?fine)/i

const MODELS: Array<[RegExp, string]> = [
  [/\b(haiku)\b|хайку/i, 'haiku'],
  [/\b(sonnet)\b|сонн?ет/i, 'sonnet'],
  [/\b(opus)\b|опус/i, 'opus'],
  [/\b(fable)\b|фейбл/i, 'fable'],
]

// Порядок важен: «очень высокое» проверяется раньше «высокого».
const EFFORTS: Array<[RegExp, Effort]> = [
  [/\bxhigh\b|очень\s+высок|сверхвысок|extra[\s-]?high/i, 'xhigh'],
  [/\bmax(imum)?\b|максимальн/i, 'max'],
  [/\blow\b|низк/i, 'low'],
  [/\bmedium\b|средн/i, 'medium'],
  [/\bhigh\b|высок/i, 'high'],
]

const firstMatch = <T,>(line: string, table: Array<[RegExp, T]>): { value: T; at: number } | undefined => {
  let best: { value: T; at: number } | undefined
  for (const [re, value] of table) {
    const m = re.exec(line)
    if (m && (best === undefined || m.index < best.at)) best = { value, at: m.index }
  }
  return best
}

/** Возвращает совет из хвоста ответа или undefined, если совета нет. */
export const parseAdvice = (text: string): Advice | undefined => {
  const tail = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .slice(-TAIL_LINES)

  // Идём снизу вверх: правила ставят совет последней строкой.
  for (let i = tail.length - 1; i >= 0; i--) {
    const line = tail[i] ?? ''
    if (FITS.test(line)) return undefined
    if (!CUE.test(line)) continue

    const model = firstMatch(line, MODELS)?.value
    // Усилие ищем рядом со словом «усилие»/«effort», чтобы «высокая цена ошибки» не сработала.
    const effortZone = /(усили|effort)/i.test(line) ? line : ''
    const effort = effortZone ? firstMatch(effortZone, EFFORTS)?.value : undefined

    if (model || effort) return { model, effort }
  }
  return undefined
}
