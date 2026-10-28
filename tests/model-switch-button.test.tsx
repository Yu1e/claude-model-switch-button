import { expect, test } from 'claude-code/testing'

import { parseAdvice } from '../hooks/parse'

const message = (text: string, requestId = 'msg-1') =>
  ({
    plugin: 'model-switch-button',
    component: 'AssistantMessage',
    requestId,
    props: { text, isFirstOfReply: true },
  }) as const

const ADVICE = 'Готово, файл отправлен.\n\nПредлагаю низкое усилие, Sonnet: правка в одну строку. Продолжить на текущих?'

test('разбор: совет, «подходят», чужой текст', async () => {
  expect(parseAdvice(ADVICE)).toEqual({ model: 'sonnet', effort: 'low' })
  expect(parseAdvice('Ответ.\n\nХватило бы: среднее усилие, Haiku 5.5.')).toEqual({ model: 'haiku', effort: 'medium' })
  expect(parseAdvice('Ответ.\n\nМодель и усилие подходят.')).toBeUndefined()
  expect(parseAdvice('Opus пишет длиннее, чем Sonnet.\n\nЕщё абзац о погоде.')).toBeUndefined()
  expect(parseAdvice('Ответ.\n\nДля такой задачи хватило бы Haiku.')).toEqual({ model: 'haiku', effort: undefined })
})

test('кнопки под советом вписывают команды в поле ввода', async ($, on) => {
  const filled: string[] = []
  on('command.list', () => ({ value: [{ name: 'effort', description: 'Set effort', source: 'builtin' }] }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('prompt.fill', (_, e) => {
    filled.push(e.text)
    return { isFilled: true }
  })
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine reply</Text>
  })

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...message(ADVICE), surface })
    expect(await ui.find({ type: 'Text', text: /engine reply/ })).toBeDefined()
    await ui.press({ key: 'msg-1-0' })
    await ui.press({ key: 'msg-1-1' })
    await ui.unmount()
  }

  expect(filled).toEqual(['/model sonnet', '/effort low', '/model sonnet', '/effort low'])
})

test('без совета ответ рисуется как есть', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>plain</Text>
  })

  const ui = await $.ui.mount({ ...message('Просто ответ.\n\nМодель и усилие подходят.'), surface: 'desktop' })
  expect(await ui.find({ type: 'Button' })).toBeUndefined()
  await ui.unmount()
})
