<template lang='pug'>
.screen-modal
  .head-option(v-for='{ name, key } in pages' :class="{ '-active': activeOption === name }")
    | [
    span.key {{ key }}
    | ]
    | {{ name | t('presenters.infoViewsHead') }}

  component(
    :is='page'
    :screen='screen'
    ref="pageComponent"
    )
</template>

<script lang='ts'>
import Vue, { Component } from 'vue'

import BasePage from './CharacterInfoPages/BasePage.vue'
import EquipmentPage from './CharacterInfoPages/EquipmentPage.vue'
import HistoryInfoPage from './CharacterInfoPages/HistoryInfoPage.vue'
import TalentsPage from './CharacterInfoPages/TalentsPage.vue'
import PowersPage from './CharacterInfoPages/PowersPage.vue'

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
      case '!':
        return this.screen.goToPowers()
      case '@':
        return this.screen.goToBaseInfo()
      case '#':
        return this.screen.goToInventory()
      case '%':
        return this.screen.goToTalents()
      case '&':
        return this.screen.goToHistoryInfo()
      case 'Escape':
        return this.screen.goIdle()
      default:
        this.$refs.pageComponent.onEvent(event)
      }
    }
  },
  computed: {
    page(): Component {
      switch(this.screen.page) {
        case CharacterInfoPage.Powers:
          return PowersPage
        case CharacterInfoPage.Base:
          return BasePage
        case CharacterInfoPage.Equipment:
          return EquipmentPage
        case CharacterInfoPage.Talents:
          return TalentsPage
        case CharacterInfoPage.History:
          return HistoryInfoPage
        default:
          return BasePage
      }
    },
    pages(): Option[] {
      return [
        { type: CharacterInfoPage.Powers, name: 'powersInfo', key: '!' },
        { type: CharacterInfoPage.Base, name: 'baseInfo', key: '@' },
        { type: CharacterInfoPage.Equipment, name: 'equipment', key: '#' },
        { type: CharacterInfoPage.Talents, name: 'talentsInfo', key: '%' },
        { type: CharacterInfoPage.History, name: 'historyInfo', key: '&' },
      ]
    },
    activeOption(): string {
      let option = this.pages.find(({ type }) => type === this.screen.page)
      return option ? option.name : 'baseInfo'
    }
  },
  components: {
    BasePage,
    EquipmentPage,
    TalentsPage,
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
  border-bottom: 1px solid gold;

  margin-bottom: 1rem;

  > .key {
    color: gold;
  }

  &.-active {
    border: 1px solid gold;
    border-bottom: none;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    vertical-align: bottom;
  }
}
</style>
