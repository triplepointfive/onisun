<template lang='pug'>
.screen-modal
  .title Character Information
  .content
    .row
      .col-md-4
        .attribute-row(v-for='info in baseInfo')
          span.name
            | {{ info.name | t('presenters.characterInfo') }}:
            |
          span.value(v-text='info.value')
      .col-md-4
</template>

<script lang='ts'>
import Vue from 'vue'

type Info = {
  name: string,
  value: string,
}

export default Vue.extend({
  name: 'CharacterInfoView',
  props: ['screen'],
  computed: {
    baseInfo(): Info[] {
      return [
        { name: 'name', value: 'Ilya' },
      ]
    }
  },
  methods: {
    onEvent(event: KeyboardEvent) {
    }
  }
})
</script>

<style lang='scss' scoped>
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
