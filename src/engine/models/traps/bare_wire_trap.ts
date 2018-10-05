import { Trap, TrapType, Tile } from '../tile'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Creature } from '../creature'
import { Point } from '../../utils/utils'
import { Calculator } from '../../lib/calculator'
import { Player } from '../player'
import { HurtEvent } from '../../events/hurt_event'
import { DieReason } from '../../events/die_event'
import { Damage, DamageType } from '../../lib/damage'
import { VisibleCreatureEvent } from '../../events/visible_creature_event'
import { Reaction } from '../../events/internal'
import { Resistance } from '../specie'

class BareWireTrapEvent extends VisibleCreatureEvent {
  constructor(private trap: Trap, levelMap: LevelMap, game: Game) {
    super(levelMap, game)
  }

  get hurtEvent(): HurtEvent {
    return new HurtEvent(this.damages, DieReason.Trap, this.levelMap, this.game)
  }

  get damages(): Damage[] {
    return [
      {
        type: DamageType.Pure,
        min: 10,
        max: 15,
        resistances: [Resistance.Insulator],
      },
    ]
  }

  public affectCreature(creature: Creature): Reaction {
    const hurtReaction = creature.on(this.hurtEvent)

    if (this.playerSees(creature)) {
      this.trap.revealed = true
    }

    this.game.logger.trapBareWire.activated(
      this.playerSees(creature),
      hurtReaction,
      creature
    )

    return hurtReaction
  }

  public affectPlayer(player: Player): Reaction {
    this.trap.revealed = true

    if (player.inventory.bootsSlot.insulator) {
      this.game.logger.trapBareWire.resist()

      return Reaction.Resist
    } else {
      const hurtReaction = player.on(this.hurtEvent)
      this.game.logger.trapBareWire.activated(true, hurtReaction, player)

      return hurtReaction
    }
  }
}

export class BareWireTrap extends Trap {
  constructor(tile: Tile, revealed: boolean = false) {
    super(TrapType.BareWire, tile, revealed)
  }

  public untrap(
    pos: Point,
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): void {
    // TODO: Do stupid thing when has low
    if (!player.inventory.glovesSlot.insulator) {
      game.logger.trapBareWire.doNotWant()
    } else if (Calculator.chance(1, 7)) {
      game.logger.failedToUntrap(player)
      // TODO: Activate on both player and creature standing on the trap
      this.activate(pos, game, levelMap, player)
    } else {
      this.disarmTile(pos, player, levelMap, game)
    }
  }

  protected buildNew(): Tile {
    return new BareWireTrap(this.tile, this.revealed)
  }

  get dodgeRatio(): number {
    return this.revealed ? 5 : 10
  }

  public activate(
    pos: Point,
    game: Game,
    levelMap: LevelMap,
    creature: Creature
  ): Reaction {
    if (Calculator.dodges(creature.bodyControl, this.dodgeRatio)) {
      return Reaction.Dodge
    }

    return creature.on(new BareWireTrapEvent(this, levelMap, game))
  }
}
