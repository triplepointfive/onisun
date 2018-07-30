<template>
  <div class='level-up text-center'>
    <table>
      <tr v-for='(group, i) in skills' :key='i'>
        <td class='cell' v-for='(skill, j) in group' :key='j'>
          <div class='skill-cell -ready' v-if='skill' >
            <img class='icon' :src='iconPath(skill)'>
            <span class="level">a {{ j }} / {{ i }}</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  props: ['screen'],
  data() {
    return {
      picked: null
    }
  },
  computed: {
    skills() {
      return [[

        undefined,
        3,
        5,
        ], [
        undefined,
        6,
      ], [

        1,
        2,
        4,
        ], [
        7,
        undefined,
        ], [

        8,
        undefined,
        ], [
        undefined,
        9,
        10,
        ]
      ]
    }
  },
  methods: {
    close(doubleClickOption) {
      this.screen.onInput(doubleClickOption || this.picked)
    },
    onEvent(event) {

    },
    iconPath(professionId: number) {
      return 'assets/professions/' + [
        'acrobatic.svg',
        'button-finger.svg',
        'disintegrate.svg',
        'flying-fox.svg',
        'amputation.svg',
        'catch.svg',
        'divert.svg',
        'fruiting.svg',
        'annexation.svg',
        'conversation.svg',
        'dodging.svg',
        'grab.svg',
        'arrest.svg',
        'convince.svg',
        'drinking.svg',
        'journey.svg',
        'back-forth.svg',
        'coronation.svg',
        'drop-weapon.svg',
        'juggler.svg',
        'backstab.svg',
        'crafting.svg',
        'drowning.svg',
        'jump-across.svg',
        'boot-stomp.svg',
        'crush.svg',
        'eating.svg',
        'kindle.svg',
        'bowman.svg',
        'discussion.svg',
        'expander.svg',
        'kneeling.svg',
      ][professionId]
    }
  },
  mounted() {
  }
})
</script>

<style lang='scss'>
.level-up {
  position: fixed;
  top: 0;
  left: 10%;
  width: 80%;
  height: 80%;
  border: 1px solid black;
  background: white;
  border-radius: 50px;
  padding: 30px;
  z-index: 3;



  background-color: black;
  border: 2px solid gold;
}

.option {
  border: 1px solid black;
&.picked {
    border-color: red;
  }

  .icon {
    width: 100px;
    height: 100px;
  }
}

.tree {
  display: grid;
  grid-template-columns: 50px 50px 50px 50px 50px;
  grid-template-rows: 50px 50px 50px 50px 50px;
  grid-row-gap: 50px;
  grid-column-gap: 20px;
}

.cell {
  padding: 25px;

}

.skill-cell {
  height: 50px;
  width: 50px;

  position: relative;
  border-radius: 5px;

  background-color: black;

  > .level {
    position: absolute;
    bottom: -5px;
    right: -5px;
    background-color: black;
    padding: 0px 2px 0px 2px;

    border-radius: 5px;

    font-size: 0.5rem;
  }

  &.-unavailable {
    border: 2px solid grey;

    .icon {
      filter: opacity(50%);
    }

    .level {
      display: none;
    }
  }

  &.-ready {
    border: 2px solid greenyellow;

    .level {
      border: 2px solid greenyellow;
      color: greenyellow;
    }
  }

  &.-completed {
    border: 2px solid gold;

    .level {
      border: 2px solid gold;
      color: gold;
    }
  }
}

.arrow {
  width:120px;

  .line {
      margin-top:14px;
      width:90px;
      background:blue;
      height:10px;
      float:left;
  }

  .point {
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-left: 30px solid blue;
      float:right;
  }
}
</style>

