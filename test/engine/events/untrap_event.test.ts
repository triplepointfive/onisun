import { generateGame, generateLevelMap, generatePlayer } from '../helpers'
import {
  Trap,
  UntrapEvent,
  Point,
  LevelMap,
  Game,
  Player,
} from '../../../src/engine'

describe('UntrapEvent', () => {
  let game: Game, levelMap: LevelMap, player: Player
  const pos = new Point(1, 1)

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
    game.player = player = generatePlayer()

    levelMap.addCreature(pos, player)
  })

  it('disarms', () => {
    let trap = new Trap()
    trap.untrap = jest.fn()

    player.on(new UntrapEvent(pos, trap, levelMap, game))

    expect(trap.untrap).toHaveBeenCalled()
  })
})
