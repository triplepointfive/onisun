<template>
  <div>Inventory</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { InventoryInputKey } from '../src/screen'

export default Vue.extend({
  name: 'Inventory',
  props: ['screen'],
  data() {
    return {
    }
  },
  methods: {
    close(inputKey) {
      this.screen.onInput(inputKey)
    },
    onEvent(event) {
      switch (event.key) {
      case 'Escape':
        return this.close(InventoryInputKey.Close)
      }
    }
  }
})
</script>

