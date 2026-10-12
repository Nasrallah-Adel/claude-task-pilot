// The three buttons and the prompt each one sends. Pure data; no engine calls here.

export type ActionId = 'status' | 'next' | 'plan'

export interface Action {
  id: ActionId
  label: string
  hotkey: string
  option: 'statusPrompt' | 'nextPrompt' | 'planPrompt'
  prompt: string
}

export const ACTIONS: readonly Action[] = [
  {
    id: 'status',
    label: 'Status',
    hotkey: 's',
    option: 'statusPrompt',
    prompt:
      'Give me a short status of the current task: what is done, what is in progress, ' +
      'and anything blocked or failing. Check the actual state (files, git, test output) ' +
      'rather than relying on memory. Do not change anything.',
  },
  {
    id: 'next',
    label: 'Next steps',
    hotkey: 'n',
    option: 'nextPrompt',
    prompt:
      'What are the next steps for the current task? List them in order, ' +
      'most important first, with one line each. Do not start on them yet.',
  },
  {
    id: 'plan',
    label: 'Plan next',
    hotkey: 'p',
    option: 'planPrompt',
    prompt:
      'Check the next steps for the current task against the actual state of the code, ' +
      'then write a step-by-step plan for them: files to change, risks, and how each step ' +
      'will be verified. Do not change any code; wait for my go-ahead.',
  },
]

/** The prompt an action sends: the user's option when set, else the built-in text. */
export function promptFor(action: Action, options: Readonly<Record<string, unknown>>): string {
  const custom = options[action.option]
  return typeof custom === 'string' && custom.trim() !== '' ? custom.trim() : action.prompt
}
