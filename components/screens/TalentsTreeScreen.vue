<template>
  <div id='talents-tree-container' class='screen-modal text-center'>
    <b-tabs card v-model='professionIndex' class='tabs-list'>
      <b-tab
        v-for='profession in screen.player.professions'
        :title='profession.name'
        :key='profession.id'
        no-body
      >
      </b-tab>
    </b-tabs>

    <table class='content'>
      <tr v-for='(group, i) in groupedTalents' :key='i'>
        <td class='cell' v-for='(talent, j) in group' :key='j'>
            <div
              class='talent-cell'
              :class='talentStatus(talent)'
              :id="j + 'exPopover1-'+i" variant="primary"
              @click='pickTalent(talent)'
              @dblclick="close(talent)"
               v-if='talent'
            >
              <img class='icon' :src="'assets/talents/' + iconPath(talent.id)">
              <span class="level">{{ talentTip(talent) }}</span>

              <b-popover :target="j + 'exPopover1-'+i" triggers="hover" container='talents-tree-container'>
                <template>
                  <p class='name'>
                    {{ talent.name }}
                  </p>
                  <small>
                    <p class='rank'>
                      Уровень {{ talent.rank }}/{{ talent.maxRank }}
                    </p>
                    <p class='requirements' v-if="talentStatus(talent) === '-unavailable'">
                      Требуется {{ talent.depth * profession.depthCost }} очков в {{ profession.name }}
                    </p>
                    <p class='description'>
                      {{ talent.description }}
                    </p>
                  </small>
                </template>
              </b-popover>
            </div>
        </td>
      </tr>
    </table>

    <b-btn variant='default' v-if='pickedId !== null' @click='close()'>Подтвердить</b-btn>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { OnisunTalentId } from 'src/onisun'

export default Vue.extend({
  props: ['screen'],
  data() {
    return {
      pickedId: null,
      professionIndex: 0
    }
  },
  computed: {
    profession() {
      return this.screen.player.professions[this.professionIndex]
    },
    groupedTalents() {
      let groups = new Array(5)
      for (let i = 0; i < groups.length; i++) {
        groups[i] = []
      }

      this.profession.talents.forEach(talent => groups[talent.depth].push(talent))

      return groups
    }
  },
  methods: {
    close(doubleClickOption) {
      if (doubleClickOption) {
        switch (this.talentStatus(doubleClickOption)) {
          case '-completed':
          case '-unavailable':
            return
        }
      }

      this.screen.onInput(this.profession.id, (doubleClickOption && doubleClickOption.id) || this.pickedId)
      this.pickedId = null
    },
    pickTalent(talent) {
      if (this.talentStatus(talent) === '-available') {
        this.pickedId = talent.id
      }
    },
    onEvent(event) {

    },
    talentTip(talent) {
      let tip = `${talent.rank}/${talent.maxRank}`
      if (talent.rank >= talent.maxRank) {
        return tip
      } else {
        return `a ${tip}`
      }
    },
    talentStatus(talent) {
      if (this.pickedId === talent.id) {
        return '-selected'
      } else if (talent.rank === talent.maxRank) {
        return '-completed'
      } else if (talent.depth * this.profession.depthCost > this.profession.points) {
        return '-unavailable'
      } else {
        return '-available'
      }
    },
    iconPath(talentId) {
      switch(talentId) {
        case OnisunTalentId.AttackerTwoHandedWeapons:
          return 'AttackerTwoHandedWeapons.svg'
        case OnisunTalentId.AttackerHeavyWeapons:
          return 'AttackerHeavyWeapons.svg'
        case OnisunTalentId.AttackerLightWeapons:
          return 'AttackerLightWeapons.svg'
        case OnisunTalentId.AttackerTwoWeapons:
          return 'AttackerTwoWeapons.svg'
        case OnisunTalentId.AttackerDoubleTwoHandedWeapons:
          return 'AttackerDoubleTwoHandedWeapons.svg'
        case OnisunTalentId.AttackerStrongGrip:
          return 'AttackerStrongGrip.svg'
      }
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
  border-radius: 50px;
  padding: 30px;
  z-index: 3;

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

#talents-tree-container {
  .tabs-list {
    .nav-link {
      background-color: black;
      border-bottom: 0;
      color: grey;

      &.active {
        color: greenyellow;
      }
    }

  }

  .popover {
    background-color: rgba(0, 0, 0, 0.9) !important;
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

.talent-cell {
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

  &.-available {
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

