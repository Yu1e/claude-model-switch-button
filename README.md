# model-switch-button

> ⚠️ **Written entirely by Claude or another AI model** (Claude is Anthropic's AI assistant). No human has reviewed the code line by line. Use at your own risk.
> ⚠️ **Написано полностью Клодом или другой ИИ-моделью** (Клод — ИИ-ассистент Anthropic). Построчной проверки кода человеком не было. Используйте на свой риск.

<details>
<summary><b>🇬🇧 English</b></summary>

A mod for Claude Code. When Claude suggests switching the model or effort at the end of a reply, a button appears under the reply. Clicking it puts a ready-made command into the input field, for example `/model sonnet` or `/effort low`, and you only need to press Enter.

## Installation

In a Claude Code terminal session:

```
/plugin install model-switch-button --marketplace Yu1e/claude-model-switch-button
```

Claude Code will ask whether to add the marketplace: answer `y`, then choose the scope (user — for all sessions).

From the shell:

```
claude plugin install model-switch-button --marketplace Yu1e/claude-model-switch-button
```

In the desktop app: the + button next to the input field → Plugins → Add marketplace → `Yu1e/claude-model-switch-button` → Add plugin.

## What counts as advice

The mod looks at the last three non-empty lines of a reply. An advice line contains a cue word (for example предлагаю, хватило бы, достаточно, переключиться, сменить, switch, suggest, and others) and a model name or an effort level next to the word «усилие» / «effort».

- Models: Haiku, Sonnet, Opus, Fable (in Latin or Cyrillic) → `/model haiku|sonnet|opus|fable`.
- Effort: низкое, среднее, высокое, очень высокое, максимальное (or low … max) → `/effort …`. The effort button appears only if the build has the `/effort` command.
- The line «Модель и усилие подходят» produces no buttons.

Example of a line under which the buttons `/model sonnet` and `/effort low` will appear:

> Suggesting low effort, Sonnet: a one-line edit. Continue on the current ones?

If the input field is occupied by a dialog or the surface draws its own field, the command is copied to the clipboard and the mod shows a notification.

## Development

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```

Tested on Claude Code 2.1.312. The mod API is in early access and may change between versions.

## License

MIT

</details>

<details>
<summary><b>🇷🇺 Русский</b></summary>

Мод для Claude Code. Когда Claude в конце ответа советует сменить модель или усилие, под ответом появляется кнопка. Нажатие вписывает в поле ввода готовую команду, например `/model sonnet` или `/effort low`, и остаётся нажать Enter.

## Установка

В терминальной сессии Claude Code:

```
/plugin install model-switch-button --marketplace Yu1e/claude-model-switch-button
```

Claude Code спросит, добавить ли маркетплейс: ответить `y`, затем выбрать область (user — для всех сессий).

Из оболочки:

```
claude plugin install model-switch-button --marketplace Yu1e/claude-model-switch-button
```

В десктопном приложении: кнопка + у поля ввода → Plugins → Add marketplace → `Yu1e/claude-model-switch-button` → Add plugin.

## Что считается советом

Мод смотрит три последние непустые строки ответа. Строка с советом содержит слово-подсказку (предлагаю, хватило бы, достаточно, переключиться, сменить, switch, suggest и др.) и название модели или уровень усилия рядом со словом «усилие» / «effort».

- Модели: Haiku, Sonnet, Opus, Fable (латиницей или кириллицей) → `/model haiku|sonnet|opus|fable`.
- Усилие: низкое, среднее, высокое, очень высокое, максимальное (или low … max) → `/effort …`. Кнопка усилия появляется, только если в сборке есть команда `/effort`.
- Строка «Модель и усилие подходят» кнопок не даёт.

Пример строки, под которой появятся кнопки `/model sonnet` и `/effort low`:

> Предлагаю низкое усилие, Sonnet: правка в одну строку. Продолжить на текущих?

Если поле ввода занято диалогом или поверхность рисует собственное поле, команда копируется в буфер обмена, и мод показывает уведомление.

## Разработка

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```

Проверено на Claude Code 2.1.312. API модов в раннем доступе и может меняться между версиями.

## Лицензия

MIT

</details>
