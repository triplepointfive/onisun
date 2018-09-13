import {
  generateGame,
  generatePlayer,
  generateCreature,
  generateLevel,
  generateLevelMap,
  generateBodyArmor,
  generateOneHandedWeapon,
} from '../helpers'
import {
  Game,
  Player,
  Creature,
  WaterDamageEvent,
  DamageType,
  LevelMap,
  Reaction,
  Material,
  CorrosionLevel,
  Calculator,
} from '../../../src/engine'

describe('WaterDamageEvent', () => {
  let game: Game, levelMap: LevelMap, player: Player, event: WaterDamageEvent
  const damages = [
    { type: DamageType.Pure, dice: { times: 0, max: 0 }, extra: 20 },
  ]

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
    game.player = player = generatePlayer()

    event = new WaterDamageEvent(damages, levelMap, game)
  })

  describe('creature', () => {
    let creature: Creature

    beforeEach(() => {
      creature = generateCreature()
      jest.spyOn(creature, 'on')
    })

    it('unaffected with water', () => {
      expect(creature.on(event)).toEqual(Reaction.RESIST)
      expect(creature.on).toHaveBeenCalledTimes(1)
    })

    it('affected with water', () => {
      creature.specie.material = Material.paper
      expect(creature.on(event)).toEqual(Reaction.HURT)
      expect(creature.on).toHaveBeenCalledTimes(2)
    })
  })

  describe('player', () => {
    describe('body parts', () => {
      it('hurts', () => {
        player.inventory.headSlot.material = Material.paper
        player.inventory.chestSlot.material = Material.paper

        expect(player.on(event)).toEqual(Reaction.HURT)
        expect(player.health.atMax).toBeFalsy()
      })

      it('kills', () => {
        player.inventory.headSlot.material = Material.paper
        player.inventory.chestSlot.material = Material.paper
        player.inventory.bootsSlot.material = Material.paper
        player.inventory.rightHandSlot.material = Material.paper

        expect(player.on(event)).toEqual(Reaction.DIE)
        expect(player.dead).toBeTruthy()
      })

      it('equipment blocks damage', () => {
        const slot = player.inventory.chestSlot
        slot.material = Material.paper
        slot.equipment = { count: 1, item: generateBodyArmor() }

        expect(player.on(event)).toEqual(Reaction.RESIST)
        expect(player.health.atMax).toBeTruthy()
      })
    })

    describe('equipment', () => {
      it('corrode', () => {
        const item = generateOneHandedWeapon()
        item.material = Material.iron
        player.inventory.rightHandSlot.equipment = { item: item, count: 1 }

        Calculator.chance = jest.fn(() => true)

        expect(player.on(event)).toEqual(Reaction.NOTHING)
        expect(item.corrosionLevel).toEqual(CorrosionLevel.Slightly)

        Calculator.chance = jest.fn(() => false)

        expect(player.on(event)).toEqual(Reaction.NOTHING)
        expect(item.corrosionLevel).toEqual(CorrosionLevel.Slightly)
      })

      it('destroys', () => {
        const item = generateOneHandedWeapon(),
          slot = player.inventory.rightHandSlot

        item.material = Material.paper
        slot.equipment = { item: item, count: 1 }

        Calculator.chance = jest.fn(() => false)

        expect(player.on(event)).toEqual(Reaction.NOTHING)
        expect(item.corrosionLevel).toEqual(CorrosionLevel.None)
        expect(slot.equipment).toBeDefined()

        Calculator.chance = jest.fn(() => true)

        expect(player.on(event)).toEqual(Reaction.NOTHING)
        expect(item.corrosionLevel).toEqual(CorrosionLevel.None)
        expect(slot.equipment).toBeUndefined()
      })
    })

    describe('inventory', () => {
      it('corrode', () => {
        const item = generateOneHandedWeapon()
        player.addItem(item, 10)
        item.material = Material.iron

        Calculator.chance = jest.fn(() => true)

        expect(player.on(event)).toEqual(Reaction.NOTHING)
        expect(item.corrosionLevel).toEqual(CorrosionLevel.Slightly)

        Calculator.chance = jest.fn(() => false)

        expect(player.on(event)).toEqual(Reaction.NOTHING)
        expect(item.corrosionLevel).toEqual(CorrosionLevel.Slightly)
      })

      it('destroys', () => {
        const item = generateOneHandedWeapon()
        player.addItem(item, 10)
        item.material = Material.paper

        Calculator.chance = jest.fn(() => false)

        expect(player.on(event)).toEqual(Reaction.NOTHING)
        expect(item.corrosionLevel).toEqual(CorrosionLevel.None)
        expect(player.inventory.findInBag(item)).toBeDefined()

        Calculator.chance = jest.fn(() => true)
        Calculator.lowerWeight = jest.fn(() => 10)

        expect(player.on(event)).toEqual(Reaction.NOTHING)
        expect(item.corrosionLevel).toEqual(CorrosionLevel.None)
        expect(player.inventory.findInBag(item)).toBeUndefined()
      })
    })
  })
})
