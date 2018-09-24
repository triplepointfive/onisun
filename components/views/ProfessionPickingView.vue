<template lang='pug'>
.screen-modal.text-center
  .title {{ 'title' | t('presenters.professionPickingView', '', { level: screen.level }) }}
  .content
    .option.p-2.m-3(
      v-for='(option, index) in screen.options'
      :key='option.id'
      @click='picked = option'
      @dblclick="close(option)"
      :class="{ 'picked': picked && picked.id === option.id }"
      )
      img.icon(:src='iconPath(option.name)')

      | [
      span.key {{ index === 0 ? 'a' : 'b' }}
      | ]
      |
      span.name {{ option.name | t('professions') }}
      div {{ 'rank' | t('presenters.professionPickingView', '', { level: option.level + 1 }) }}
  .bottom
    b-btn(@click='close' v-if='picked !== null' variant='success') Подтвердить
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  props: ['screen'],
  data() {
    return {
      picked: null
    }
  },
  methods: {
    close(doubleClickOption) {
      const option = doubleClickOption || this.picked
      if (option) {
        this.screen.pickProfession(option)
      }
    },
    onEvent(event: KeyboardEvent) {
      switch(event.key) {
      case 'a':
        this.picked = this.screen.options[0]
        break
      case 'b':
        this.picked = this.screen.options[1]
        break
      case ' ':
      case 'Enter':
        this.close()
      default:
        return
      }
    },
    iconPath(professionName: string): string {
      return `assets/professions/${professionName}.svg`
    }
  }
})
</script>

<style lang='scss' scoped>
.option {
  border: 1px solid white;
  display: inline-block;
  border-radius: 1rem;
  color: white;

  &.picked {
    border-color: gold;
  }

  .key, .name {
    color: gold;
  }

  .icon {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>
