<template lang='pug'>
.screen-modal
  .h4.title Ты умер

  .content.mt-5
    blockquote.blockquote.text-center.signature
      p.mb-0(v-text='message')
      footer.blockquote-footer(v-text='signature')
</template>

<script lang='ts'>
import Vue from 'vue'
import { DieReason } from '../../src/engine'

export default Vue.extend({
  name: 'DeathView',
  props: ['screen'],
  computed: {
    message(): string {
      switch (this.screen.dieReason) {
      case DieReason.Attack:
        return 'Смерть в бою честь для героя. Но жить мне все-таки нравилось больше'
      case DieReason.Missile:
        return 'Раньше меня вела дорога приключений, но теперь и мне прострелили колено'
      case DieReason.Trap:
        return 'Я так и не научился смотреть под ноги'
      case DieReason.Overloaded:
        return 'Тяжко уйти от бремени, которое сам себе навязываешь.'
      default:
        return 'Скучная смерть, которая даже не заслужила отдельного сообщения'
      }
    },
    signature(): string {
      return `Признался ${this.screen.playerName} перед смертью`
    }
  },
  methods: {
    onEvent(event: KeyboardEvent) {
    }
  }
})
</script>

<style lang='scss'>
.signature {
  color: gold;
}
</style>
