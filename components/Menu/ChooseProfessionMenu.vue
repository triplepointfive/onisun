<template lang="pug">
.content
  .subtitle Choose your profession:

  .professions-list
    .profession-option(
      v-for='(profession, i) in menu.professions'
      :class='{ "-picked": profession === pickedProfession }'
      @click='pickedProfession = profession'
      )
      img.icon(:src='iconPath(profession.name)')

      .note
        span.key
          | [
          span.char {{ i | indexLetter }}
          | ]
          |
        span.name {{ profession.name | t('professions') }}

  .menu-options
    MenuOption(char='Enter' name='Done' v-if='ready' :separator='true')
    MenuOption(char='=' name='Back' :separator='!ready')
</template>

<script lang="ts">
import Vue from 'vue'

import MenuOption from '../MenuOption.vue'

import { Profession } from 'src/onisun'

const LETTER_OFFSET = 97

// TODO: Add random option

export default Vue.extend({
  name: 'ChooseProfessionMenu',
  props: ['menu'],
  data() {
    return {
      pickedProfession: undefined as Profession | undefined
    }
  },
  computed: {
    ready(): boolean {
      return this.pickedProfession !== undefined
    }
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      switch (event.key) {
        case 'Enter':
          if (this.pickedProfession) {
            this.menu.withProfession(this.pickedProfession)
          }
          return
        case '=':
          return this.menu.back()
      default:
        return this.selectAt(event.key.charCodeAt(0) - LETTER_OFFSET)
      }
    },
    selectAt(i: number) {
      const profession = this.menu.professions[i]
      this.pickedProfession = profession || this.pickedProfession
    },
    iconPath(professionName: string): string {
      return `assets/professions/${professionName}.svg`
    }
  },
  components: {
    MenuOption
  }
})
</script>

<style lang="scss" scoped>
.professions-list {
  display: flex;
  flex-wrap: wrap;
  align-content: stretch;
  justify-content: space-around;
}

.profession-option {
  border: 1px solid white;
  display: inline-block;
  border-radius: 1rem;
  color: white;
  padding: 0.2rem;
  margin: 0.2rem;
  width: 25%;
  cursor: pointer;

  text-align: center;

  &.-picked {
    border-color: gold;

    .key {
      display: none;
    }
  }

  .char, .name {
    color: gold;
  }

  .icon {
    width: 50px;
    height: 50px;
    display: block;
    margin: auto;
  }
}
</style>
