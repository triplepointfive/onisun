<template lang='pug'>
.screen-modal
  .title {{ 'title' | t('presenters.talentsPickingView') }}

  TalentsPage(
    ref="talentsComponent"
    :screen='screen.talentsPage'
    :picking-enabled='true'
    @pickTalent='pickTalent'
    )
</template>

<script lang='ts'>
import Vue from 'vue'
import { TalentStatus, Profession, Talent } from 'src/engine'

import TalentsPage from './CharacterInfoPages/TalentsPage.vue'

export default Vue.extend({
  props: ['screen'],
  name: 'TalentsPickingView',
  methods: {
    pickTalent(profession: Profession, talent: Talent): void {
      this.screen.pickTalent(profession, talent)
    },
    onEvent(event: KeyboardEvent): void {
      this.$refs.talentsComponent.onEvent(event)
    },
  },
  components: {
    TalentsPage,
  }
})
</script>
