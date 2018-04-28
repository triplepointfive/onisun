<template lang='slm'>
  #app
    .col
      table.game-table
        tr.row v-for="(row, i) in map"
          Cell[
            :cell="cell"
            v-for="(cell, j) in row"
            :key="i + '-' + j"
            :style='visibility(i, j)'
            :player="player.x == j && player.y == i"
            ]

      button @click="map = buildMap()"
        | Generate!

      label radius
      input type="number" v-model="radius"

    .col
      .block v-for="(tile, i) in blocks"
        .wrapper
          table.content.game-table
            tr.row v-for="(row, i) in rawToTiles(tile.content)"
              Cell[
                :cell="cell"
                v-for="(cell, j) in row"
                :key="i + '-' + j"
                ]

          input type="number" v-model="tile.weight"
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'

import Cell from './Cell.vue'

import { Visibility, Fov } from './fov'
import { Walker, Memory, MemoryTile } from './creatures/walker'

import * as _ from 'lodash'

import { Block, Map, Tile, BlockRepository, LevelMap } from './grid'

export default Vue.extend({
  data() {
    return {
      blocks: [
        { content: [
          "WWW",
          "WWW",
          "WWW",
        ], weight: 0.5},

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
      radius: 10,
      player: {
        x: 1,
        y: 1,
      }
    }
  },
  components: {
    Cell
  },
  computed: {
    fov(): MemoryTile[][] {
      if (this.map) {
        let map = new LevelMap(this.map)

        let walker = new Walker(
          this.player.x,
          this.player.y,
          this.radius,
          map.width,
          map.height,
        )

        walker.act(map)
        return walker.stageMemory.field
      }

      return []
    }
  },
  methods: {
    updatePlayerPosition(x: number, y: number) {
      this.player.x = x;
      this.player.y = y;
    },
    buildMap() {
      let blockRepository = new BlockRepository(
        new Block(this.rawToTiles(this.blocks[0].content), this.blocks[0].weight));
      _.tail(this.blocks).forEach(({ content, weight }) => {
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
    },
    visibility(i: number, j: number) {
      if (this.fov[i][j].visible) {
        return { 'opacity': this.fov[i][j].degree }
      } else {
        return { background: 'black', color: 'black' }
      }
    }
  },
  created() {
    // TODO: OMG
    eval("this.map = this.buildMap()");
  }
})
</script>

<style lang='scss'>
.game-table {
  border-collapse: collapse;
  background-color: black;

  td {
    padding: 0px;
    width: 1em;
    height: 0.1em;
  }
}

.col {
  float: left;
  margin-right: 1em;
}
.block {
  margin-bottom: 1em;

  .wrapper {
    .content {
      border: solid 1px black;
      display: inline-block;
    }
  }
}
.row {
  white-space: nowrap;
}
</style>
