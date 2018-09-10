import {
  generateGame,
  generateLevelMap,
  generateCreature,
  generateItem,
  generatePlayer,
} from '../helpers'
import {
  LevelMap,
  Game,
  Creature,
  DieEvent,
  DieReason,
  Point,
  Corpse,
  DeathPresenter,
} from '../../../src/engine'

describe('DieEvent', () => {
  const pos = new Point(1, 1)
  let game: Game, levelMap: LevelMap

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
  })

  describe('creature', () => {
    let creature: Creature

    beforeEach(() => {
      creature = generateCreature()
      levelMap.addCreature(pos, creature)
    })

    it('creature leaves corpse', () => {
      creature.specie.leavesCorpseRatio = 1
      creature.on(new DieEvent(game, levelMap, DieReason.Attack))

      expect(creature.dead).toBeTruthy()
      expect(levelMap.at(pos.x, pos.y).creature).toBeUndefined()
      expect(levelMap.at(pos.x, pos.y).items.bunch[0].item).toBeInstanceOf(
        Corpse
      )
    })

    it('creature leaves corpse', () => {
      creature.specie.leavesCorpseRatio = 1
      creature.on(new DieEvent(game, levelMap, DieReason.Attack))

      expect(creature.dead).toBeTruthy()
      expect(levelMap.at(pos.x, pos.y).creature).toBeUndefined()
      expect(levelMap.at(pos.x, pos.y).items.bunch[0].item).toBeInstanceOf(
        Corpse
      )
    })

    it('creature does not leaves corpse, leaves carrying items', () => {
      const item = generateItem()

      creature.specie.leavesCorpseRatio = 0
      creature.addItem(item, 2)

      creature.on(new DieEvent(game, levelMap, DieReason.Attack))

      expect(creature.dead).toBeTruthy()
      expect(levelMap.at(pos.x, pos.y).creature).toBeUndefined()
      expect(levelMap.at(pos.x, pos.y).items.bunch[0].item).toEqual(item)
    })
  })

  it('player', () => {
    let player = generatePlayer()
    game.player = player

    levelMap.addCreature(pos, player)

    player.on(new DieEvent(game, levelMap, DieReason.Overloaded))

    expect(player.dead).toBeTruthy()

    player.ai.endTurn()
    expect(player.ai.presenter).toBeInstanceOf(DeathPresenter)
  })
})
