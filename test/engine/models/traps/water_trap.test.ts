import { generateGame, generateLevelMap, generatePlayer } from '../../helpers'
import { Game, LevelMap, Player, WaterTrap, Room } from '../../../../src/engine'

describe('WaterTrap', () => {
  let game: Game, levelMap: LevelMap, player: Player, trap: WaterTrap

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
    game.player = player = generatePlayer()

    trap = new WaterTrap(new Room())
  })

  it('builds new', () => {
    expect(trap.clone()).toBeInstanceOf(WaterTrap)
  })
})
