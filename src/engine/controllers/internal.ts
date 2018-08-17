import { Logger } from '../logger'
import { Player, Creature, Reaction } from '../creature'
import { ThrowEvent } from '../events/internal'
import { Game } from '../game'
import { Tile } from '../tile'
import { Point } from '../utils'
import { IdlePresenter, GroupedItem, ItemFlightEffect } from '../../engine'
import { MissilePresenter } from '../presenters/missile_presenter'
import { LevelMap } from '../level_map'
import { Presenter } from '../presenters/internal'

export abstract class Controller {
  protected logger: Logger
  protected player: Player

  constructor(protected game: Game) {
    this.player = game.player
    this.logger = game.logger
  }

  public abstract act(): void

  protected currentLevel(): LevelMap {
    return this.player.currentLevel
  }

  protected tile(): Tile {
    return this.currentLevel().at(this.player.pos.x, this.player.pos.y)
  }

  protected endTurn(): void {
    this.game.ai.endTurn()
  }

  protected redirect(presenter: Presenter): void {
    this.game.ai.redirect(presenter)
  }
}

export class MissileAttackController extends Controller {
  constructor(private path: Point[], game: Game) {
    super(game)
  }

  public act(): void {
    const slot = this.player.inventory.missileSlot,
      missile = slot.equipment.item

    slot.removeItem(this.player, 1)

    let flightPath: Point[] = [],
      victim: Creature

    this.path.forEach(point => {
      if (!victim) {
        const tile = this.player.currentLevel.at(point.x, point.y)
        victim = tile.creature && tile.creature.real()
        flightPath.push(point)
      }
    })

    this.game.effect = new ItemFlightEffect(missile, flightPath, () => {
      if (victim) {
        victim.on(new ThrowEvent(this.player, missile)) === Reaction.DIE
      }

      this.endTurn()
    })
  }
}
