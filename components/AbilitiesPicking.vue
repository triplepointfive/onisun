<template>
  <div id='skill-tree-container' class='ability-picking text-center'>
    <h3 class='title'>Защита</h3>

    <table class='content'>
      <tr v-for='(group, i) in skills' :key='i'>
        <td class='cell' v-for='(skill, j) in group' :key='j'>
            <div
              class='skill-cell -ready'
              :id="'exPopover1-'+i" variant="primary"
               v-if='skill'
            >
              <img class='icon' :src='iconPath(skill)'>
              <span class="level">a {{ j }} / {{ i }}</span>

              <b-popover :target="'exPopover1-'+i" triggers="hover" container='skill-tree-container'>
                <template>
                  <p class='name'>
                    Lorem ipsum dolor sit amet
                  </p>
                  <small>
                    <p class='rank'>
                      Rank 0/2
                    </p>
                    <p class='requirements'>
                      Requires 5 points in adipiscing elit
                    </p>
                    <p class='description'>
                      Mauris in elit sed mauris egestas porta. Cras accumsan commodo augue.
                    </p>
                  </small>
                </template>
              </b-popover>
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
.ability-picking {
  position: fixed;
  top: 10%;
  transform: translate(-50%, 0);
  left: 50%;

  border: 1px solid black;
  background: white;
  border-radius: 50px;
  padding: 30px;
  z-index: 3;

  background-color: black;
  border: 2px solid gold;

  .title {
    color: white;
  }

  .content {
    margin: auto;

    .cell {
      padding: 25px;
    }
  }
}

#skill-tree-container {
  .popover {
    background-color: rgba(0, 0, 0, 0.5) !important;
    border: 2px solid grey !important;
    margin: 0 !important;

    .arrow {
      display: none !important;
    }

    .popover-body {
      padding: 0.5rem;
    }

    p {
      margin-bottom: 0;
    }

    .name {
      color: white;
    }

    .rank {
      color: white;
    }

    .requirements {
      color: red;
    }

    .description {
      color: gold;
    }
  }
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

  &.-selected {
    border: 2px solid white;

    .level {
      border: 2px solid white;
      color: white;
    }
  }
}
</style>

