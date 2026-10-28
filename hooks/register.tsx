import type { Register } from 'claude-code'

import { parseAdvice } from './parse'

export const register: Register = on => {
  // Есть ли в этой сборке команда /effort; без неё кнопку усилия не рисуем.
  let hasEffort = false

  on('session.start', async ($, e, next) => {
    try {
      const commands = await $.command.list()
      hasEffort = commands.some(c => c.name === 'effort')
    } catch {
      hasEffort = false
    }
    return next(e)
  })

  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    const drawn = await next(e)
    if (e.props.isSummary) return drawn

    const advice = parseAdvice(e.props.text)
    if (!advice) return drawn

    const commands: string[] = []
    if (advice.model) commands.push(`/model ${advice.model}`)
    if (advice.effort && hasEffort) commands.push(`/effort ${advice.effort}`)
    if (commands.length === 0) return drawn

    const { Box, Button } = $.ui.resolve(e)
    const surface = e.surface

    const put = async (command: string) => {
      const filled = await $.prompt.fill({ text: command })
      if (filled.isFilled) return

      // Поле занято диалогом или поверхность рисует своё поле: кладём команду в буфер обмена.
      const copied = await $.ui.copy({ text: command, surface })
      $.ui.toast(
        filled.refusal === 'dialog'
          ? `Сначала закройте диалог. ${command} скопирована`
          : `${command} скопирована, вставьте в поле ввода`,
      )
      return copied
    }

    return (
      <Box flexDirection="column">
        {drawn}
        <Box gap={1}>
          {commands.map((command, i) => (
            <Button
              key={`${e.requestId}-${i}`}
              label={command}
              dimColor
              onPress={() => put(command)}
            />
          ))}
        </Box>
      </Box>
    )
  })
}
