<template>
  <div id="app">
    <div class="row" v-for="(row, i) in map">
      <Cell :cell="cell" v-for="(cell, j) in row" :key="i + '-' + j"/>
    </div>


    <div class="block" v-for="(tile, i) in blocks">
      <div class="row" v-for="(row, i) in rawToTiles(tile.content)">
        <Cell :cell="cell" v-for="(cell, j) in row" :key="i + '-' + j"/>
      </div>
    </div>

    <button @click="map = buildMap()">Generate!</button>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

import Cell from './Cell.vue'

import { Block, Map, Tile, BlockRepository } from './grid'

export default Vue.extend({
  data() {
    return {
      blocks: [
        { content: [
          "RRR",
          "RRR",
          "RRR",
        ], weight: 20},

        { content: [
          "WCW",
          "RRR",
          "RRR",
        ], weight: 20},
        { content: [
          "WWC",
          "RRR",
          "RRR",
        ], weight: 20},
        { content: [
          "CWC",
          "RRR",
          "RRR",
        ], weight: 20},
        { content: [
          "WWW",
          "RRR",
          "RRR",
        ], weight: 20},

        { content: [
          "WCW",
          "CRR",
          "WRR",
        ], weight: 20},
        { content: [
          "WWW",
          "WRR",
          "WRR",
        ], weight: 20},
        { content: [
          "WWW",
          "CRR",
          "WRR",
        ], weight: 20},
        { content: [
          "WWC",
          "WRR",
          "WRR",
        ], weight: 20},
        { content: [
          "WWC",
          "WRR",
          "CRR",
        ], weight: 20},

        { content: [
          "WWW",
          "CCW",
          "WCW",
        ], weight: 20},
        { content: [
          "WWW",
          "CCC",
          "WWW",
        ], weight: 20},
        { content: [
          "WCW",
          "CCC",
          "WWW",
        ], weight: 20},
        { content: [
          "WCW",
          "CCC",
          "WCW",
        ], weight: 20},
      ],
      map: [],
    }
  },
  components: {
    Cell
  },
  // computed: {
  //   blockRepository() {

  //     return blockRepository;
  //   }
  // },
  methods: {
    buildMap() {
      let blockRepository = new BlockRepository(
        new Block(this.rawToTiles([
          "WWW",
          "WWW",
          "WWW",
        ]), 0.5)
      );
      this.blocks.forEach(({ content, weight }) => {
        blockRepository.addBlock(new Block(this.rawToTiles(content), weight));
      });

      let blockMap = new Map(20, 20, blockRepository);
      blockMap.fillMap(1, 1);
      blockMap.postProcess();
      return blockMap.toMap();
    },
    rawToTiles(map: string[]): Tile[][] {
      let tiles: Tile[][] = [];
      map.forEach((row) => {
        let tileRow: Tile[] = [];
        row.split("").forEach((key) => {
          tileRow.push(Tile.retrive(key));
        });
        tiles.push(tileRow);
      });
      return tiles;
    }
  }
})
</script>

<style>
.block {
  border: solid 1px black;
}
.row {
  line-height: 1rem;
  white-space: nowrap;
}
</style>
