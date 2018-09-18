import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import Polyglot from 'node-polyglot'

import './application.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import Title from './Title.vue'

Vue.use(BootstrapVue)

fetch('locales/en.json').then((response) => response.json()).then((body) => {
  const polyglot = new Polyglot({ phrases: body, locale: 'en' })

  Vue.filter('t', (key: string, namespace: string, args: any) => {
    return polyglot.t(`${namespace}.${key}`, args)
  })

  new Vue({
    el: '#app',
    render: h => h(App)
  })
})
