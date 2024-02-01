/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import '@/styles/vuetify/_index.scss'
import 'vuetify/styles'

import { VBtn } from 'vuetify/lib/components/index.mjs'

// Composables
import { createVuetify } from 'vuetify'

import defaults from './defaults'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
        variables: {
          "theme-background": '#373538',
          "theme-surface": '#4C4A4D'
        }
      },
    },
  },
  aliases: {
    IconBtn: VBtn,
    CloseBtn: VBtn
  },
  defaults
})
