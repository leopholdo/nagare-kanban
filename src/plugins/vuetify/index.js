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

// Translation
import { pt } from 'vuetify/locale'

import defaults from './defaults'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  locale: {
    locale: 'pt',
    fallback: 'pt',
    messages: { pt },
  },
  theme: {
    defaultTheme: 'dark',
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
          grey: '#9E9E9E',
          'grey-lighten-5': '#FAFAFA',
          'grey-lighten-4': '#F5F5F5',
          'grey-lighten-3': '#EEEEEE',
          'grey-lighten-2': '#E0E0E0',
          'grey-lighten-1': '#BDBDBD',
          'grey-darken-1': '#757575',
          'grey-darken-2': '#616161',
          'grey-darken-3': '#424242',
          'grey-darken-4': '#212121'
        },
        variables: {
          // "theme-background": '#373538',
          "theme-background": '#2a3034',
          "theme-surface": '#4C4A4D'
        }
      },
    },
  },
  aliases: {
    IconBtn: VBtn,
    CloseBtn: VBtn,
    BackBtn: VBtn,
    MenuBtn: VBtn,
  },
  defaults
})
