<template lang="pug">
.content
  .content-col
    .attribute-row
      span.name
        | {{ 'name' | t('presenters.baseInfo') }}:
        |
      span.value {{ screen.name }}
    .attribute-row
      span.name
        | {{ 'height' | t('presenters.baseInfo') }}:
        |
      span.value {{ screen.height }}sm
    .attribute-row
      span.name
        | {{ 'weight' | t('presenters.baseInfo') }}:
        |
      span.value {{ screen.weight }}kg
    .attribute-row
      span.name
        | {{ 'gender' | t('presenters.baseInfo') }}:
        |
      span.value {{ screen.gender | t('genders') }}
  .content-col
    .attribute-row
      span.name
        | {{ 'eye' | t('presenters.baseInfo') }}:
        |
      span.value {{ screen.eyeColor | t('colors') }}
    .attribute-row
      span.name
        | {{ 'hair' | t('presenters.baseInfo') }}:
        |
      span.value {{ screen.hairColor | t('colors') }}
    .attribute-row
      span.name
        | {{ 'skin' | t('presenters.baseInfo') }}:
        |
      span.value {{ screen.skinColor | t('colors') }}
  .content-col
    .attribute-row
      span.name
        | {{ 'turns' | t('presenters.baseInfo') }}:
        |
      span.value {{ screen.turns }}
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HistoryInfoPage',
  props: ['screen'],
  methods: {
    onEvent(event: KeyboardEvent): void {}
  }
})
</script>

<style lang="scss" scoped>
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

  > .name {
    color: yellow;
  }

  > .value {
    color: white;
  }
}
</style>
