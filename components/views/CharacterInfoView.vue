<template lang='pug'>
.screen-modal
  .title Character Information

  .head-option(v-for='{ name, key } in pages' :class="{ '-active': activeOption === name }")
    | [
    span.key {{ key }}
    | ]
    | {{ name | t('presenters.infoViewsHead') }}

  BasePage(:screen='screen')
</template>

<script lang='ts'>
import Vue from 'vue'

import BasePage from './CharacterInfoPages/BasePage.vue'
import { CharacterInfoPage, CharacterInfoPresenter } from '../../src/onisun'

type Option = {
  type: CharacterInfoPage,
  name: string,
  key: string
}

export default Vue.extend({
  name: 'CharacterInfoView',
  props: ['screen'],
  methods: {
    onEvent(event: KeyboardEvent): void {
      switch (event.key) {
      case 'Escape':
        return this.screen.goIdle()
      }
    }
  },
  computed: {
    pages(): Option[] {
      return [
        { type: CharacterInfoPage.Base, name: 'baseInfo', key: '@' },
        { type: CharacterInfoPage.Talents, name: 'talentsInfo', key: '#' }
      ]
    },
    activeOption(): string {
      let option = this.pages.find(({ type }) => type === screen.page)
      return option ? option.name : 'baseInfo'
    }
  },
  components: {
    BasePage
  }
})
</script>

<style lang='scss' scoped>
.head-option {
  background-color: black;
  display: inline-block;
  padding: 1rem;
  cursor: pointer;

  color: white;

  > .key {
    color: gold;
  }

  &.-active {
    border: 1px solid gold;
    border-bottom: none;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }
}
</style>
