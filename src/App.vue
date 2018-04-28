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
            :player="walker.x == j && walker.y == i"
            ]

      button @click="map = buildMap()"
        | Generate!

      label radius
      input type="number" v-model="radius"

      button @click="pause = !pause"
        | {{ pause ? 'Start' : 'Pause' }}

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
      },
      pause: true,
      ts: Date.now(),
    }
  },
  components: {
    Cell
  },
  computed: {
    walker() {
      if (this.map) {
        return new Walker(
          this.player.x,
          this.player.y,
          this.radius,
          this.levelMap.width,
          this.levelMap.height,
        )
      }
    },
    levelMap() {
      if (this.map) {
        return new LevelMap(this.map)
      }

    },
    fov(): MemoryTile[][] {
      if (this.ts && this.map) {
        return this.walker.stageMemory.field
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

      clearInterval(this.walkerinterval)
      this.walkerinterval = setInterval(() => {
        if (this.pause) {
          return
        }

        try {
          if (this.walker) {
            this.walker.act(this.levelMap)
            this.ts = Date.now()
            // this.pause = true
            // this.player.x = this.walker.x
            // this.player.y = this.walker.y
          }
        } catch (e) {
          console.error(e)
          this.pause = true
        }

      }, 300);

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
      if (this.fov.length) {
        if (this.fov[i][j].visible) {
          return { opacity: this.fov[i][j].degree }
        } else if (this.fov[i][j].seen) {
          return { background: 'black', color: 'darkgrey', opacity: 0.3 }
        } else {
          return { background: 'black', color: 'black' }
        }
      } else {
        return { background: 'black', color: 'darkgrey' }
      }
    }
  },
  created() {
    this.map = this.buildMap()
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
