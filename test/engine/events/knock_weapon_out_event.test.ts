import {
  generateLevelMap,
  generateGame,
  generatePlayer,
  generateCreature,
  generateOneHandedWeapon,
} from '../helpers'
import {
  Creature,
  Player,
  LevelMap,
  Game,
  Point,
  Calculator,
  Reaction,
  ImpactType,
} from '../../../src/engine'
import { KnockWeaponOutEvent } from '../../../src/engine/events/knock_weapon_out_event'

describe('KnockWeaponOutEvent', () => {
  let creature: Creature, player: Player, levelMap: LevelMap, game: Game

  beforeEach(() => {
    player = generatePlayer()
    game = generateGame({ player })
    game.currentMap = levelMap = generateLevelMap()

    creature = generateCreature()

    levelMap.addCreature(new Point(1, 1), player)
    levelMap.addCreature(new Point(1, 2), creature)

    creature.canBeDisarmed = jest.fn(() => true)
    player.canBeDisarmed = jest.fn(() => true)

    player.inventory.leftHandSlot.equipment = {
      item: generateOneHandedWeapon(),
      count: 1,
    }
    player.inventory.rightHandSlot.equipment = {
      item: generateOneHandedWeapon(),
      count: 1,
    }
  })

  describe('not available', () => {
    it('creature', () => {
      player.canBeDisarmed = jest.fn(() => false)
      expect(
        creature.on(new KnockWeaponOutEvent(player, levelMap, game))
      ).toEqual(Reaction.NOTHING)
    })

    it('player', () => {
      creature.canBeDisarmed = jest.fn(() => false)
      expect(
        player.on(new KnockWeaponOutEvent(creature, levelMap, game))
      ).toEqual(Reaction.NOTHING)
    })
  })

  describe('misses', () => {
    beforeEach(() => {
      Calculator.misses = jest.fn(() => true)
    })

    it('creature', () => {
      expect(
        creature.on(new KnockWeaponOutEvent(player, levelMap, game))
      ).toEqual(Reaction.DODGE)
    })

    it('player', () => {
      expect(
        player.on(new KnockWeaponOutEvent(creature, levelMap, game))
      ).toEqual(Reaction.DODGE)
    })
  })

  describe('failed', () => {
    beforeEach(() => {
      Calculator.misses = jest.fn(() => false)
      Calculator.chance = jest.fn(() => false)
    })

    it('creature', () => {
      expect(
        creature.on(new KnockWeaponOutEvent(player, levelMap, game))
      ).toEqual(Reaction.RESIST)
    })

    it('player', () => {
      expect(
        player.on(new KnockWeaponOutEvent(creature, levelMap, game))
      ).toEqual(Reaction.RESIST)
    })
  })

  describe('hit', () => {
    beforeEach(() => {
      Calculator.misses = jest.fn(() => false)
      Calculator.chance = jest.fn(() => true)
    })

    describe('creature', () => {
      it('both hands with weapons', () => {
        expect(
          creature.on(new KnockWeaponOutEvent(player, levelMap, game))
        ).toEqual(Reaction.Success)

        expect(player.inventory.rightHandSlot.equipment).toBeUndefined()
        expect(player.inventory.leftHandSlot.equipment).toBeUndefined()

        const tile = levelMap.creatureTile(player)
        expect(tile.items.bunch.length).toEqual(2)
      })

      it('both hands with one hand empty', () => {
        player.inventory.leftHandSlot.equipment = undefined

        expect(
          creature.on(new KnockWeaponOutEvent(player, levelMap, game))
        ).toEqual(Reaction.Success)

        expect(player.inventory.rightHandSlot.equipment).toBeUndefined()
        expect(player.inventory.leftHandSlot.equipment).toBeUndefined()
      })

      it('right hand', () => {
        Calculator.chance.mockReturnValueOnce(true) // success
        Calculator.chance.mockReturnValueOnce(false) // both hands
        Calculator.chance.mockReturnValueOnce(true) // right hand

        expect(
          creature.on(new KnockWeaponOutEvent(player, levelMap, game))
        ).toEqual(Reaction.Success)

        expect(player.inventory.rightHandSlot.equipment).toBeUndefined()
        expect(player.inventory.leftHandSlot.equipment).toBeDefined()
      })

      it('left hand', () => {
        Calculator.chance.mockReturnValueOnce(true) // success
        Calculator.chance.mockReturnValueOnce(false) // both hands
        Calculator.chance.mockReturnValueOnce(false) // right hand

        expect(
          creature.on(new KnockWeaponOutEvent(player, levelMap, game))
        ).toEqual(Reaction.Success)

        expect(player.inventory.leftHandSlot.equipment).toBeUndefined()
        expect(player.inventory.rightHandSlot.equipment).toBeDefined()
      })
    })

    it('player', () => {
      expect(
        player.on(new KnockWeaponOutEvent(creature, levelMap, game))
      ).toEqual(Reaction.Success)
      expect(creature.hasImpact(ImpactType.Disarmed)).toBeTruthy()
    })
  })
})
