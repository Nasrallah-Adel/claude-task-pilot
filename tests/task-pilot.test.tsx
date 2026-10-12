// task-pilot end to end through the engine's kit: the three buttons, their prompts,
// the custom-prompt options, the wait-while-working toast and the bands beneath.
import { describe, expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

type Calls = { submitted: string[]; toasts: string[] }

function fakeEngine(on: On): Calls {
  const c: Calls = { submitted: [], toasts: [] }
  on('prompt.submit', ($, e) => { c.submitted.push(e.text); return { text: e.text, origin: e.origin } as never })
  on('ui.toast', ($, e) => { c.toasts.push((e as { text: string }).text); return { value: undefined } as never })
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>beneath</Text>
  })
  return c
}

const props = (isWorking = false, hasSurvey = false) =>
  ({ hasSurvey, isWorking, maxRows: 3, bodyColumns: 120, scroll: { bodyRows: 3, top: 0 }, view: {} }) as never
const band = ($: Engine, surface: 'terminal' | 'desktop', isWorking = false) =>
  $.ui.mount({ plugin: 'task-pilot', surface, component: 'AbovePrompt', props: props(isWorking) })

describe('the band', () => {
  test('draws three buttons above the bands beneath and each sends its prompt', async ($, on) => {
    const c = fakeEngine(on)
    for (const surface of ['terminal', 'desktop'] as const) {
      c.submitted.length = 0
      const ui = await band($, surface)
      expect((await ui.findAll({ type: 'Button' })).length).toBe(3)
      expect(await ui.find({ type: 'Text', text: /beneath/ })).toBeDefined()
      await ui.press({ key: 'status' })
      await ui.press({ key: 'next' })
      await ui.press({ key: 'plan' })
      expect(c.submitted.length).toBe(3)
      expect(c.submitted[0]).toContain('status of the current task')
      expect(c.submitted[1]).toContain('next steps')
      expect(c.submitted[2]).toContain('step-by-step plan')
      await ui.unmount()
    }
  })

  test('while a turn runs a press only toasts', async ($, on) => {
    const c = fakeEngine(on)
    const ui = await band($, 'terminal', true)
    await ui.press({ key: 'plan' })
    expect(c.submitted).toEqual([])
    expect(c.toasts.at(-1)).toContain('wait for the turn to finish')
  })

  test('a survey hides the row and keeps what is beneath', async ($, on) => {
    fakeEngine(on)
    const ui = await $.ui.mount({ plugin: 'task-pilot', surface: 'terminal', component: 'AbovePrompt', props: props(false, true) })
    expect((await ui.findAll({ type: 'Button' })).length).toBe(0)
    expect(await ui.find({ type: 'Text', text: /beneath/ })).toBeDefined()
  })

  test('a custom prompt option replaces the built-in text', { options: { nextPrompt: '  what now?  ' } }, async ($, on) => {
    const c = fakeEngine(on)
    const ui = await band($, 'terminal')
    await ui.press({ key: 'next' })
    expect(c.submitted).toEqual(['what now?'])
  })
})
