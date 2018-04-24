<template>
  <div id="app">{{ msg }}</div>
</template>

<script lang="ts">
import Vue from 'vue'

import map from './grid'

export default Vue.extend({
  data() {
    return {
      msg: map
    }
  }
})
</script>
