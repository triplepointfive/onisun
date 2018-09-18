<template lang='pug'>
.screen-modal
  .title Character Information
  .content
    .content-col
      .attribute-row
        span.name
          | {{ 'name' | t('presenters.characterInfo') }}:
          |
        span.value {{ screen.name }}
      .attribute-row
        span.name
          | {{ 'height' | t('presenters.characterInfo') }}:
          |
        span.value {{ screen.height }}sm
      .attribute-row
        span.name
          | {{ 'weight' | t('presenters.characterInfo') }}:
          |
        span.value {{ screen.weight }}kg
      .attribute-row
        span.name
          | {{ 'gender' | t('presenters.characterInfo') }}:
          |
        span.value {{ screen.gender | t('genders') }}
    .content-col
      .attribute-row
        span.name
          | {{ 'eye' | t('presenters.characterInfo') }}:
          |
        span.value {{ screen.eyeColor | t('colors') }}
      .attribute-row
        span.name
          | {{ 'hair' | t('presenters.characterInfo') }}:
          |
        span.value {{ screen.hairColor | t('colors') }}
      .attribute-row
        span.name
          | {{ 'skin' | t('presenters.characterInfo') }}:
          |
        span.value {{ screen.skinColor | t('colors') }}
</template>

<script lang='ts'>
import Vue from 'vue'
import { CharacterInfoPresenter } from '../../src/onisun'

export default Vue.extend({
  name: 'CharacterInfoView',
  props: {
    screen: { type: CharacterInfoPresenter }
  },
  methods: {
    onEvent(event: KeyboardEvent) {
    }
  }
})
</script>

<style lang='scss' scoped>
.content-col {
  display: inline-block;
  vertical-align: top;
  margin-right: 3rem;
}

.attribute-row {
  > td {
    border: none;
    padding: 0;
  }

  > .name { color: yellow;
  }

  > .value {
    color: white;
  }
}

</style>
