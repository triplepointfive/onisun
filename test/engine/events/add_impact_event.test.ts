import { generateGame, generatePlayer } from '../helpers'
import { ImpactType, AddImpactEvent, Game, Player } from '../../../src/engine'

describe('AddImpactEvent', () => {
  let game: Game, player: Player
  const impact = ImpactType.Blind

  beforeEach(() => {
    game = generateGame()
    game.player = player = generatePlayer()
  })

  it('removes const effect', () => {
    expect(player.hasImpact(impact)).toBeFalsy()
    player.on(new AddImpactEvent(impact, 'shoes', game))
    expect(player.hasImpact(impact)).toBeTruthy()
  })

  it('removes temp effect', () => {
    expect(player.hasImpact(impact)).toBeFalsy()
    player.on(new AddImpactEvent(impact, 'drink', game, 10))
    expect(player.hasImpact(impact)).toBeTruthy()
  })
})
