# task-pilot

A Claude Code mod that puts three buttons above the prompt:

```
task [ Status ] [ Next steps ] [ Plan next ]
```

| Button | Hotkey | Sends |
| --- | --- | --- |
| **Status** | `s` | Asks for a short status of the current task (done / in progress / blocked), checked against the real files, git and test output. Changes nothing. |
| **Next steps** | `n` | Asks for the ordered list of next steps. Doesn't start on them. |
| **Plan next** | `p` | Checks the next steps against the code and writes a step-by-step plan (files, risks, verification), then waits for your go-ahead. |

Each button submits its prompt as if you typed it. While a turn is running, a press only shows a toast asking you to wait. The row stacks over other mods' bands instead of hiding them.

Hotkeys work after focusing the band (`ctrl+x` then `tab` by default).

## Install

```
/plugin install task-pilot --marketplace Nasrallah-Adel/claude-task-pilot
```

Or clone it into `~/.claude/skills/task-pilot` and run `/reload-plugins`.

## Options

Set in `/config` (all optional; empty keeps the built-in prompt):

- **Status button prompt** (`statusPrompt`)
- **Next steps button prompt** (`nextPrompt`)
- **Plan next button prompt** (`planPrompt`)

## Develop

```
claude plugin validate .
claude plugin test .
```

## License

MIT
