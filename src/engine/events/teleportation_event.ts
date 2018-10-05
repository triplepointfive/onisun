import { VisibleCreatureEvent } from './visible_creature_event'
import { Creature } from '../models/creature'
import { Player } from '../models/player'
import { withMatchingTile } from '../lib/post'
import { MoveEvent } from './move_event'
import { Point } from '../utils/utils'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { Resistance } from '../models/specie'
import { AITeleportationEvent } from '../ai/player_ai'
import { Reaction } from './internal'

// TODO: Creature that teleports itself away
export class TeleportationEvent extends VisibleCreatureEvent {
  constructor(levelMap: LevelMap, game: Game, private selfCast: boolean) {
    super(levelMap, game)
  }

  public affectCreature(actor: Creature): Reaction {
    if (this.playerSees(actor)) {
      if (
        actor.hasResistance(Resistance.TeleportationControl) ||
        !this.teleport(actor)
      ) {
        this.game.logger.creatureNotTeleported(actor)
      } else {
        this.game.logger.creatureTeleported(actor)
      }
    } else {
      this.teleport(actor)
    }

    // TODO: Add a message if player sees new position

    return Reaction.Nothing
  }

  public affectPlayer(player: Player): Reaction {
    if (player.hasResistance(Resistance.TeleportationControl)) {
      if (!this.selfCast) {
        this.game.logger.playerTeleportationCaused()
      }

      player.ai.pushEvent(new AITeleportationEvent(this.levelMap, this.game))
      this.game.playerTurn = true
    } else if (this.teleport(player)) {
      if (!this.selfCast) {
        this.game.logger.playerTeleported()
      }
    } else {
      this.game.logger.playerNotTeleported()
    }

    return Reaction.Nothing
  }

  protected teleport(actor: Creature): boolean {
    let teleported = false

    try {
      withMatchingTile(
        this.levelMap,
        tile => tile.free(),
        (x, y) => {
          teleported = true
          actor.on(new MoveEvent(this.game, this.levelMap, new Point(x, y)))
        }
      )
    } catch {}

    return teleported
  }
}
