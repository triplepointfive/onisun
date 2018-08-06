import { ProfessionPicker, Player } from '../src/engine'
import { generateProfession, generatePlayer } from './helpers'

describe('ProfessionPicker', () => {
  let profession1,
    profession2,
    profession3,
    pool,
    player: Player,
    picker: ProfessionPicker

  beforeEach(() => {
    profession1 = generateProfession()
    profession2 = generateProfession()
    profession3 = generateProfession()

    pool = [profession1, profession2, profession3]

    player = generatePlayer()
  })

  describe('when level up available', () => {
    beforeEach(() => {
      picker = new ProfessionPicker(pool, 2, 3)
    })

    it('picks random ones when multiple options available', () => {
      expect(picker.available(player).length).toEqual(2)
    })

    it('returns updatable profession', () => {
      player.professions.push(profession1)
      expect(
        picker.available(player).find(p => p.id === profession1.id)
      ).toBeTruthy()
    })
  })

  describe('without level up', () => {
    beforeEach(() => {
      picker = new ProfessionPicker(pool, 1, 2)
    })

    it('picks random ones when multiple options available', () => {
      expect(picker.available(player).length).toEqual(2)
    })

    it('picks remaining ones', () => {
      player.professions.push(profession1)
      expect(
        picker
          .available(player)
          .map(p => p.id)
          .sort()
      ).toEqual([profession2.id, profession3.id].sort())
    })

    it('nothing to return', () => {
      player.professions.push(profession1)
      player.professions.push(profession2)
      expect(picker.available(player).length).toEqual(0)
    })
  })
})
