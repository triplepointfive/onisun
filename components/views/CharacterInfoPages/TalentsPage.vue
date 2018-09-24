<template lang='pug'>
#talents-container.simple-popover.talents-container
  .professions
    .profession-block(
        v-for='(profession, index) in screen.professions'
        :key='profession.id'
        :class="{ '-active': profession.name == pickedProfession.name }"
        @click='pickProfession(profession)'
      )
      | [
      .key {{ index + 1 }}
      | ] {{ profession.name | t('professions') }} ({{ profession.level }})

  .talents
    .subtitle.mb-3 {{ 'talentsTaken' | t('presenters.talentsPage', '', { count: pickedProfession.points }) }}
    table
      tr(v-for='(row, i) in pickedProfession.grid' :key='i')
        td.cell(v-for='(talent, j) in row' :key='j')
          .talent-cell(
            v-if='talent'
            :class='talentPickedStatus(talent)'
            :id="j + 'talentTree-'+i"
            variant="primary"
            @click='pickTalent(talent)'
            dblclick="confirmPick(talent)"
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

  b-btn.confirm(variant='default' v-if='picked' @click='confirmPick()') Подтвердить
</template>

<script lang='ts'>
import Vue from 'vue'
import { TalentStatus, Profession, Talent } from 'src/engine'

const LETTER_OFFSET = 97

export default Vue.extend({
  name: 'TalentsPage',
  props: ['screen', 'pickingEnabled'],
  data() {
    return {
      picked: undefined as Talent | undefined,
      pickedProfession: this.screen.professions[0] as Profession
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
    confirmPick(doubleClickTalent: Talent | undefined) {
      const pickedTalent = doubleClickTalent || this.picked

      if (pickedTalent && pickedTalent.status(this.pickedProfession) === TalentStatus.Available) {
        this.$emit('pickTalent', this.pickedProfession, pickedTalent)
      }
    },
    pickProfession(profession: Profession): void {
      if (profession && this.pickedProfession && this.pickedProfession.name !== profession.name) {
        this.picked = undefined
        this.pickedProfession = profession
      }
    },
    pickTalent(talent: Talent) {
      if (this.pickingEnabled && talent.status(this.pickedProfession) === TalentStatus.Available) {
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
        return this.pickProfession(this.screen.professions[parseInt(event.key) - 1])
      case ' ':
      case 'Enter':
        console.log('a')
        return this.confirmPick()
      default:
        for (let talent of this.pickedProfession.talents) {
          if (this.nameToLetter[talent.name] === event.key) {
            this.pickTalent(talent)
            break
          }
        }
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

  .confirm {
    display: block;
  }
}

.profession-block {
  padding: 0.5rem;
  border: 1px solid black;
  color: white;
  cursor: pointer;

  &:hover {
    border-color: gold;
  }

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
