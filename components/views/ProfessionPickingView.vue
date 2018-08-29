<template lang='pug'>
.screen-modal.text-center
  .title {{ screen.title }}
  .content
    .option.p-2.m-3(
      v-for='option in screen.options'
      :key='option.id'
      @click='picked = option'
      @dblclick="close(option)"
      :class="{ 'picked': picked && picked.id === option.id }"
      )
      img.icon(:src='iconPath(option.id)')
      .name {{ option.name }}
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
    onEvent(event) {
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
    iconPath(professionId: number) {
      return 'assets/professions/' + [
        'acrobatic.svg',
        'button-finger.svg',
        'disintegrate.svg',
        'flying-fox.svg',
        'amputation.svg',
        'catch.svg',
        'divert.svg',
        'fruiting.svg',
        'annexation.svg',
        'conversation.svg',
        'dodging.svg',
        'grab.svg',
        'arrest.svg',
        'convince.svg',
        'drinking.svg',
        'journey.svg',
        'back-forth.svg',
        'coronation.svg',
        'drop-weapon.svg',
        'juggler.svg',
        'backstab.svg',
        'crafting.svg',
        'drowning.svg',
        'jump-across.svg',
        'boot-stomp.svg',
        'crush.svg',
        'eating.svg',
        'kindle.svg',
        'bowman.svg',
        'discussion.svg',
        'expander.svg',
        'kneeling.svg',
      ][professionId]
    }
  }
})
</script>

<style lang='scss'>
.option {
  border: 1px solid white;
  display: inline-block;
  border-radius: 1rem;

  &.picked {
    border-color: gold;
  }

  .name {
    color: white;
  }

  .icon {
    width: 100px;
    height: 100px;
  }
}
</style>
