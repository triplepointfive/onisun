<template lang="pug">
.background.my-3
  p You were born {{ player.specie.gender | t('genders') }} {{ player.specie.race.name }}
  p Your parents were {{ player.specie.parentsProfession.name | t('professions') }}.
  p During your live you obtained basic skills of {{  player.specie.ownProfession.name | t('professions')  }}.
  p Now at age {{ player.age || 30 }} you decided to begin your journey.
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PlayerBackground',
  props: ['player']
})
</script>

<style lang="scss" scoped>
.background {
  color: white;

  > p {
    margin: 0;
  }
}
</style>
