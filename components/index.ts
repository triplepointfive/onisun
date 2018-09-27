import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import Polyglot from 'node-polyglot'

import './application.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import Title from './Title.vue'

Vue.use(BootstrapVue)

fetch('locales/en.json', { cache: 'no-store' }).then((response) => response.json()).then((body) => {
  const polyglot = new Polyglot({ phrases: body, locale: 'en' })

  Vue.filter('t', (key: string, prefix: string, suffix: string, args: any) => {
    return polyglot.t(suffix ? `${prefix}.${key}.${suffix}` : `${prefix}.${key}`, args)
  })

  const LETTER_OFFSET = 97

  Vue.filter('indexLetter', (index: number) => {
    return String.fromCharCode(LETTER_OFFSET + index)
  })

  new Vue({
    el: '#app',
    render: h => h(Title)
  })
})
