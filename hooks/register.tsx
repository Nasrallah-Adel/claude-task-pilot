/**
 * task-pilot: three buttons above the prompt.
 *
 *   [ Status ]      asks where the current task stands
 *   [ Next steps ]  asks what is left to do
 *   [ Plan next ]   checks those steps and writes a plan, without changing code
 *
 * Each button submits its prompt as if you typed it. While a turn runs the
 * buttons stay drawn but only say to wait. The band stacks over other mods'
 * bands (whatever the plugins beneath draw stays under this row).
 */
import type { EngineInterface, Register } from 'claude-code'
import { ACTIONS, promptFor } from './prompts'
import type { Action } from './prompts'

async function send($: EngineInterface, action: Action, text: string, isWorking: boolean): Promise<void> {
  if (isWorking) {
    $.ui.toast(`task-pilot: wait for the turn to finish, then press ${action.label}`)
    return
  }
  try {
    await $.prompt.submit({ text, asUser: true })
  } catch (err) {
    $.ui.log(`task-pilot: ${action.id} submit failed (${String(err)})`, { to: 'debug' })
    const filled = await $.prompt.fill({ text }).catch(() => ({ isFilled: false }))
    $.ui.toast(filled.isFilled ? 'task-pilot: the prompt is in the box, press Enter to send it' : `task-pilot: could not send ${action.label}`)
  }
}

export const register: Register = (on, options) => {
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const below = await next(e)
    const isWorking = e.props.isWorking === true
    return (
      <Box flexDirection="column">
        <Box>
          <Text dimColor>task </Text>
          {ACTIONS.map((action) => (
            <Button
              key={action.id}
              label={action.label}
              hotkey={action.hotkey}
              onPress={() => send($, action, promptFor(action, options), isWorking)}
            />
          ))}
        </Box>
        {below}
      </Box>
    )
  })
}
