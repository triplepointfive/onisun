import { Trap, Tile, TrapType } from '../tile'
import { Player } from '../player'
import { LevelMap } from '../level_map'
import { Game } from '../game'
import { Creature } from '../creature'
import { Point, Direction, bresenhamInclusion } from '../../utils/utils'
import { Calculator } from '../../lib/calculator'
import { TrapEvent } from '../../events/trap_event'
import { BodyPart } from '../inventory_slot'
import { Item } from '../item'
import { RemoveItemEvent } from '../../events/remove_item_event'
import { shuffle } from 'lodash'
import { MoveEvent } from '../../events/move_event'
import { Reaction } from '../../../engine'

export class AirBlowTrap extends Trap {
  constructor(tile: Tile, revealed: boolean = false) {
    super(TrapType.AirBlow, tile, revealed)
  }

  public untrap(
    pos: Point,
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): void {
    if (Calculator.chance(4, 6)) {
      game.logger.failedToUntrap(player)

      // TODO: Activate on creature on trap or on player
      if (Calculator.chance(3, 5)) {
        this.activate(pos, game, levelMap, player)
      }
    } else {
      this.disarmTile(pos, player, levelMap, game)
    }
  }

  protected buildNew(): Tile {
    return new AirBlowTrap(this.tile, this.revealed)
  }

  get dodgeRatio(): number {
    return this.revealed ? 6 : 15
  }

  get creatureWeightBlowThreshold(): number {
    return 60
  }

  public activate(
    pos: Point,
    game: Game,
    levelMap: LevelMap,
    creature: Creature
  ): Reaction {
    return creature.on(
      new TrapEvent(
        this,
        levelMap,
        game,
        (sees, isPlayer) =>
          game.logger.trapAirBlow.dodge(sees, isPlayer, creature),
        (sees, isPlayer) => {
          // EXTRA: Blow away stuff lying on a trap cell
          if (
            creature.weightWithCarryings >= this.creatureWeightBlowThreshold
          ) {
            game.logger.trapAirBlow.resist(sees, isPlayer, creature)
          } else {
            let newPos = this.randomPos(
              pos,
              levelMap,
              Calculator.higherWeight(3, 1),
              tile => tile.passibleThrough(creature)
            )
            if (newPos.eq(pos)) {
              game.logger.trapAirBlow.resist(sees, isPlayer, creature)
            } else {
              game.logger.trapAirBlow.activate(sees, isPlayer, creature)
              creature.on(new MoveEvent(game, levelMap, newPos))
            }
          }

          if (isPlayer) {
            const player = game.player,
              inventory = player.inventory,
              slots: [BodyPart, number, (item: Item) => void][] = [
                [
                  inventory.headSlot,
                  3,
                  item => game.logger.trapAirBlow.headBlow(item),
                ],
                [
                  inventory.rightHandSlot,
                  40 / player.strength.current,
                  item => game.logger.trapAirBlow.handBlow(item),
                ],
                [
                  inventory.leftHandSlot,
                  45 / player.strength.current,
                  item => game.logger.trapAirBlow.handBlow(item),
                ],
              ]

            slots.forEach(
              ([slot, maxChance, logger]: [
                BodyPart,
                number,
                (item: Item) => void
              ]) => {
                if (
                  slot.equipment &&
                  maxChance >= 3 &&
                  Calculator.chance(1, Math.round(maxChance))
                ) {
                  logger(slot.equipment.item)
                  this.throwItem(pos, levelMap, slot.equipment.item)
                  player.on(new RemoveItemEvent(slot, 1, game))
                }
              }
            )
          }

          return Reaction.Nothing
        }
      )
    )
  }

  protected throwItem(pos: Point, levelMap: LevelMap, item: Item): void {
    let newPos = this.randomPos(
      pos,
      levelMap,
      Calculator.lowerWeight(5, 1),
      (tile: Tile) => tile.isFloor()
    )
    levelMap.at(newPos.x, newPos.y).addItem(item, 1)
  }

  protected randomPos(
    origin: Point,
    levelMap: LevelMap,
    maxDistance: number,
    matcher: (tile: Tile) => boolean
  ): Point {
    let lastPos = origin,
      foundPos = false

    shuffle(Direction.all).forEach(direction => {
      if (!foundPos) {
        let brokenLos = false

        bresenhamInclusion(
          origin,
          origin.add(direction.multiple(maxDistance)),
          (x, y) => {
            if (
              !brokenLos &&
              levelMap.inRange(new Point(x, y)) &&
              matcher(levelMap.at(x, y))
            ) {
              lastPos = new Point(x, y)
              foundPos = true
            } else {
              brokenLos = true
            }
          }
        )
      }
    })

    return lastPos
  }
}
