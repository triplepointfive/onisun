import { AI } from './internal'
import { Player } from '../models/player'
import { Logger } from '../models/logger'
import { Game, ItemsBunch, Item } from '../../engine'

export abstract class AIEvent {
  protected logger: Logger
  protected player: Player

  constructor(protected game: Game) {
    this.player = game.player
    this.logger = game.logger
  }

  public abstract run(): void
}

export class AIItemPickedEvent extends AIEvent {
  constructor(public items: ItemsBunch<Item>, game: Game) {
    super(game)
  }

  public run(): void {}
}

export abstract class MetaAI extends AI {
  constructor(public aiToRun: AI | undefined = undefined) {
    super()
  }
  protected events: AIEvent[] = []

  public pushEvent(event: AIEvent) {
    this.events.push(event)
  }

  protected resetEvents(): void {
    this.events = []
  }

  public runEvents(): boolean {
    let res = false
    this.events.forEach(event => {
      res = true
      event.run()
    })

    this.resetEvents()
    return res
  }
}
