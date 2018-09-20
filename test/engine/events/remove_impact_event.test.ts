import { generateGame, generatePlayer } from '../helpers'
import {
  ImpactType,
  RemoveImpactEvent,
  Game,
  Player,
} from '../../../src/engine'

describe('RemoveImpactEvent', () => {
  let game: Game, player: Player
  const impact = ImpactType.Blind

  beforeEach(() => {
    game = generateGame()
    game.player = player = generatePlayer()
  })

  it('removes const effect', () => {
    const source = 'shoes'
    player.addConstImpact(impact, source)

    expect(player.hasImpact(impact)).toBeTruthy()
    player.on(new RemoveImpactEvent(impact, game, source))
    expect(player.hasImpact(impact)).toBeFalsy()
  })

  it('removes temp effect', () => {
    player.addImpact(impact, 10)

    expect(player.hasImpact(impact)).toBeTruthy()
    player.on(new RemoveImpactEvent(impact, game))
    expect(player.hasImpact(impact)).toBeFalsy()
  })
})
