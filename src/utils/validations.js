export const required = (v) => {
  return !!v || 'O campo é obrigatório.'
}

export const email = (v) => {
  return (/.+@.+\..+/.test(v)) || 'O e-mail deve ser válido.'
}