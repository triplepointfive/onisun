<template lang='pug'>
#talents-container.simple-popover.talents-container
  .professions
    .profession-block(
        v-for='(profession, index) in screen.professions'
        :key='profession.id'
        :class="{ '-active': profession.name == pickedProfession.name }"
      )
      | [
      .key {{ index + 1 }}
      | ] {{ profession.name   | t('professions') }}

  table.talents
    tr(v-for='(row, i) in pickedProfession.grid' :key='i')
      td.cell(v-for='(talent, j) in row' :key='j')
        .talent-cell(
          v-if='talent'
          :class='talentPickedStatus(talent)'
          :id="j + 'talentTree-'+i"
          variant="primary"
          click='pickTalent(talent)'
          dblclick="close(talent)"
          )
          img.icon(:src="'assets/talents/' + iconPath(talent)")
          span.level {{ talentTip(talent) }}

          b-popover(:target="j + 'talentTree-'+i" triggers="hover" container='talents-container')
            template
              p.name {{ talent.name | t('talents', 'name') }}
              small
                p.rank {{ 'rank' | t('presenters.talentsPage', '', { current: talent.rank, max: talent.maxRank }) }}
                p.requirements(v-if="talentPickedStatus(talent) === '-unavailable'")
                  | {{ 'requirements' | t('presenters.talentsPage', '', { req: talent.depth * pickedProfession.depthCost }) }}
                  | {{ pickedProfession.name | t('professions') }}
                p.description {{ talent.name | t('talents', 'description') }}
</template>

<script lang='ts'>
import Vue from 'vue'
import { TalentStatus, Profession, Talent } from 'src/engine'

const LETTER_OFFSET = 97

export default Vue.extend({
  name: 'TalentsPage',
  props: ['screen'],
  data() {
    return {
      picked: undefined as Talent | undefined,
      pickedProfession: this.screen.professions[0]
    }
  },
  computed: {
    nameToLetter() {
      let nameToLetter: { [key: string]: string } = {},
       index: number = 0

      for (let row of this.pickedProfession.grid) {
        for (let talent of row) {
          if (talent) {
            nameToLetter[talent.name] = String.fromCharCode(LETTER_OFFSET + index++)
          }
        }
      }

      return nameToLetter
    }
  },
  methods: {
    close(doubleClickOption = undefined) {
      const talent = doubleClickOption || this.picked

      if (!talent || talent.status(this.pickedProfession) !== TalentStatus.Available) {
        return
      }

      this.screen.pickTalent(this.pickedProfession.id, talent.name)
      this.picked = undefined
    },
    pickTalent(talent: Talent) {
      if (talent.status(this.pickedProfession) === TalentStatus.Available) {
        this.picked = talent
      }
    },
    onEvent(event: KeyboardEvent): void {
      switch (event.key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        this.pickedProfession = this.screen.professions[parseInt(event.key) - 1] || this.pickedProfession
      }
    },
    talentTip(talent: Talent): string {
      let tip = `${talent.rank}/${talent.maxRank}`
      if (talent.rank >= talent.maxRank) {
        return tip
      } else {
        return `${this.nameToLetter[talent.name]} ${tip}`
      }
    },
    talentPickedStatus(talent: Talent): string | undefined {
      if (this.picked && this.picked.name === talent.name) {
        return '-selected'
      }
      switch(talent.status(this.pickedProfession)) {
      case TalentStatus.Available:
        return '-available'
      case TalentStatus.Unavailable:
        return '-unavailable'
      case TalentStatus.Completed:
        return '-completed'
      }
    },
    iconPath(talent: Talent): string {
      switch(talent.name) {
        default:
          return 'AttackerStrongGrip.svg'
      }
    }
  }
})
</script>

<style lang='scss' scoped>
.talents-container {
  .professions {
    display: inline-block;
    vertical-align: top;
    margin-right: 3rem;
  }

  .talents {
    display: inline-block;
  }
}

.profession-block {
  padding: 0.5rem;
  border: 1px solid black;
  color: white;

  &.-active {
    border-color: gold;
  }

  .key {
    display: inline;
    color: gold;
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
