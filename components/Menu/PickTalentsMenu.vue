<template lang="pug">
.content
  .subtitle.mb-3 Pick talents ({{ menu.points }} left)

  TalentsPage(
    ref="talentsComponent"
    :screen='menu.talentsPage'
    :picking-enabled='true'
    @pickTalent='pickTalent'
    )
</template>

<script lang="ts">
import Vue from 'vue'

import PlayerBackground from '../PlayerBackground.vue'
import TalentsPage from '../views/CharacterInfoPages/TalentsPage.vue'

import { Profession, Talent } from '../../src/onisun'

export default Vue.extend({
  name: 'HistoryMenu',
  props: ['menu'],
  components: {
    TalentsPage
  },
  methods: {
    onEvent(event: KeyboardEvent) {
      this.$refs.talentsComponent.onEvent(event)
    },
    pickTalent(profession: Profession, talent: Talent): void {
      this.menu.pickTalent(profession, talent)
    }
  }
})
</script>
