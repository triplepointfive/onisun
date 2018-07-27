import { AI } from './internal'
import { Creature, Player, AttackEvent } from '../creature'
import { ItemsBunch } from '../items/internal'
import { Direction } from '../utils'
import { StairwayDown, StairwayUp } from '../tile';

export enum AIEventType {
  ItemPickedUp,
  Move,
  HandleEnv,
}

export abstract class AIEvent {
  constructor(public type: AIEventType) {}

  public act(player: Player): void {}
}

export class AIItemPickedEvent extends AIEvent {
  constructor(public items: ItemsBunch) {
    super(AIEventType.ItemPickedUp)
  }
}

export class AIMoveEvent extends AIEvent {
  constructor(public direction: Direction) {
    super(AIEventType.Move)
  }

  public act(player: Player): void {
    const stage = player.currentLevel,
      dest = player.pos.add(this.direction),
      tile = stage.at(dest.x, dest.y)

    if (tile.passibleThrough(player)) {
      player.move(dest)
    } else if (tile.creature) {
      tile.creature.real().on(new AttackEvent(player))
    } else {
      stage.game.logger.ranIntoAnObstacle()
    }
  }
}

export class AIHandleEnvEvent extends AIEvent {
  constructor() {
    super(AIEventType.HandleEnv)
  }

  public act(player: Player): void {
    const tile = player.currentLevel.at(player.pos.x, player.pos.y)

    if (tile instanceof StairwayDown || tile instanceof StairwayUp) {
      tile.go(player)
    } else {
      player.currentLevel.game.logger.howToHandle()
    }
  }
}

export abstract class MetaAI extends AI {
  constructor(public aiToRun: AI = null) {
    super()
  }
  protected events: AIEvent[] = []

  public available(actor: Creature): boolean {
    return true
  }

  public pushEvent(event: AIEvent) {
    this.events.push(event)
  }

  protected resetEvents(): void {
    this.events = []
  }
}
