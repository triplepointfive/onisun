<template lang='pug'>
#talents-tree-container.simple-popover.screen-modal.text-center
  b-tabs.tabs-list(card v-model='professionIndex')
    b-tab(
      v-for='profession in screen.player.professions'
      :title='profession.name'
      :key='profession.id'
      no-body
      )

  table.content
    tr(v-for='(group, i) in groupedTalents' :key='i')
      td.cell(v-for='(talent, j) in group' :key='j')
          .talent-cell(
            :class='talentStatus(talent)'
            :id="j + 'talentTree-'+i"
            variant="primary"
            @click='pickTalent(talent)'
            @dblclick="close(talent)"
            )
            img.icon(:src="'assets/talents/' + iconPath(talent.id)")
            span.level {{ talentTip(talent) }}

            b-popover(:target="j + 'talentTree-'+i" triggers="hover" container='talents-tree-container')
              template
                p.name {{ talent.name }}
                small
                  p.rank Уровень {{ talent.rank }}/{{ talent.maxRank }}
                  p.requirements(v-if="talentStatus(talent) === '-unavailable'")
                    | Требуется {{ talent.depth * profession.depthCost }} очков в {{ profession.name }}
                  p.description {{ talent.description }}

  b-btn(variant='default' v-if='picked !== null' @click='close()') Подтвердить
</template>

<script lang='ts'>
import Vue from 'vue'
import { OnisunTalentId } from 'src/onisun'
import { TalentStatus } from 'src/engine';

const LETTER_OFFSET = 97

export default Vue.extend({
  props: ['screen'],
  data() {
    return {
      picked: null,
      professionIndex: 0
    }
  },
  computed: {
    option() {
      return this.screen.options[this.professionIndex]
    },
    profession() {
      return this.option.profession
    },
    groupedTalents() {
      let groups = new Array(5)
      for (let i = 0; i < groups.length; i++) {
        groups[i] = []
      }

      let availableIndex = 0

      this.option.talents.forEach(talent => {
        if (talent.status === TalentStatus.Available) {
          Object.assign(talent, {
            letter: String.fromCharCode(LETTER_OFFSET + availableIndex++)
          })
        }

        groups[talent.depth].push(talent)
      })

      return groups
    }
  },
  methods: {
    close(doubleClickOption) {
      const talent = doubleClickOption || this.picked

      if (!talent || talent.status !== TalentStatus.Available) {
        return
      }

      this.screen.onInput(this.profession.id, talent.id)
      this.picked = null
    },
    pickTalent(talent) {
      if (talent.status === TalentStatus.Available) {
        this.picked = talent
      }
    },
    onEvent(event) {
      switch(event.key) {
      case ' ':
      case 'Enter':
        this.close()
      default:
        this.groupedTalents.forEach(group => group.forEach(talent => {
          if (talent.letter === event.key) {
            this.picked = talent
          }
        }))

        const index = parseInt(event.key)
        if (index >= 1 && index <= this.screen.options.length) {
          this.professionIndex = index - 1
        }
      }
    },
    talentTip(talent) {
      let tip = `${talent.rank}/${talent.maxRank}`
      if (talent.rank >= talent.maxRank) {
        return tip
      } else {
        return `${talent.letter} ${tip}`
      }
    },
    talentStatus(talent) {
      if (this.picked && this.picked.id === talent.id) {
        return '-selected'
      }
      switch(talent.status) {
      case TalentStatus.Available:
        return '-available'
      case TalentStatus.Unavailable:
        return '-unavailable'
      case TalentStatus.Completed:
        return '-completed'
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
  watch: {
    professionIndex() {
      this.picked =  null
    }
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

