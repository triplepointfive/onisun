<template>
  <div id='skill-tree-container' class='ability-picking text-center'>
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
      <tr v-for='(group, i) in groupedSkills' :key='i'>
        <td class='cell' v-for='(skill, j) in group' :key='j'>
            <div
              class='skill-cell'
              :class='skillStatus(skill)'
              :id="j + 'exPopover1-'+i" variant="primary"
              @click='pickSkill(skill)'
              @dblclick="close(skill)"
               v-if='skill'
            >
              <img class='icon' :src="'assets/skills/' + iconPath(skill.id)">
              <span class="level">{{ skillTip(skill) }}</span>

              <b-popover :target="j + 'exPopover1-'+i" triggers="hover" container='skill-tree-container'>
                <template>
                  <p class='name'>
                    {{ skill.name }}
                  </p>
                  <small>
                    <p class='rank'>
                      Уровень {{ skill.rank }}/{{ skill.maxRank }}
                    </p>
                    <p class='requirements' v-if="skillStatus(skill) === '-unavailable'">
                      Требуется {{ skill.depth * profession.depthCost }} очков в {{ profession.name }}
                    </p>
                    <p class='description'>
                      {{ skill.description }}
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
import { OnisunDefenderProfession, OnisunSkillId } from 'src/onisun'

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
    groupedSkills() {
      let groups = new Array(5)
      for (let i = 0; i < groups.length; i++) {
        groups[i] = []
      }

      this.profession.skills.forEach(skill => groups[skill.depth].push(skill))

      return groups
    }
  },
  methods: {
    close(doubleClickOption) {
      if (doubleClickOption) {
        switch (this.skillStatus(doubleClickOption)) {
          case '-completed':
          case '-unavailable':
            return
        }
      }

      this.screen.onInput(this.profession.id, (doubleClickOption && doubleClickOption.id) || this.pickedId)
      this.pickedId = null
    },
    pickSkill(skill) {
      if (this.skillStatus(skill) === '-available') {
        this.pickedId = skill.id
      }
    },
    onEvent(event) {

    },
    skillTip(skill) {
      let tip = `${skill.rank}/${skill.maxRank}`
      if (skill.rank >= skill.maxRank) {
        return tip
      } else {
        return `a ${tip}`
      }
    },
    skillStatus(skill) {
      if (this.pickedId === skill.id) {
        return '-selected'
      } else if (skill.rank === skill.maxRank) {
        return '-completed'
      } else if (skill.depth * this.profession.depthCost > this.profession.points) {
        return '-unavailable'
      } else {
        return '-available'
      }
    },
    iconPath(skillId) {
      switch(skillId) {
        case OnisunSkillId.AttackerTwoHandedWeapons:
          return 'AttackerTwoHandedWeapons.svg'
        case OnisunSkillId.AttackerHeavyWeapons:
          return 'AttackerHeavyWeapons.svg'
        case OnisunSkillId.AttackerLightWeapons:
          return 'AttackerLightWeapons.svg'
        case OnisunSkillId.AttackerTwoWeapons:
          return 'AttackerTwoWeapons.svg'
        case OnisunSkillId.AttackerDoubleTwoHandedWeapons:
          return 'AttackerDoubleTwoHandedWeapons.svg'
        case OnisunSkillId.AttackerStrongGrip:
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

