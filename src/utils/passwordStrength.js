export const passwordStrength = [
  {
    type: 'letter',
    label: '1 letra',
    valid: false,
    validator: ((password) => { return password.match(/[a-zA-Z]+/) != null})
  },
  {
    type: 'number',
    label: '1 número',
    valid: false,
    validator: ((password) => { return password.match(/\d+/) != null })
  },
  {
    type: 'special',
    label: '1 caractere especial (exemplo: # ? ! &)',
    valid: false,
    validator: ((password) => { return password.match(/[^a-zA-Z0-9\s]/) != null })
  },
  {
    type: 'character',
    label: '10 caracteres',
    valid: false,
    validator: ((password) => { return password.length >= 10 })
  }
]