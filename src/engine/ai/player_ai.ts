import {
  AfterEvent,
  Game,
  IdlePresenter,
  LevelMap,
  ProfessionPickingPresenter,
  TalentsPickingPresenter,
  TeleportationPresenter,
} from '../../engine'
import { DieReason } from '../events/die_event'
import { CreatureEvent } from '../events/internal'
import { Player } from '../models/player'
import { DeathPresenter } from '../presenters/death_presenter'
import { Presenter } from '../presenters/internal'
import { AIEvent, MetaAI } from './meta_ai'

export class AINewLevelEvent extends AIEvent {
  constructor(public level: number, private levelMap: LevelMap, game: Game) {
    super(game)
  }

  public run(): void {
    if (this.level % 3 === 0) {
      this.game.player.ai.presenter = new ProfessionPickingPresenter(
        this.level,
        this.levelMap,
        this.game
      )
    } else {
      this.game.player.ai.presenter = new TalentsPickingPresenter(
        this.level,
        this.levelMap,
        this.game
      )
    }
  }
}

export class AIDieEvent extends AIEvent {
  constructor(
    private dieReason: DieReason,
    private levelMap: LevelMap,
    game: Game
  ) {
    super(game)
  }

  public run(): void {
    this.game.player.rebuildVision(this.levelMap)
    this.game.playerTurn = true
    this.game.player.ai.presenter = new DeathPresenter(
      this.dieReason,
      this.levelMap,
      this.game
    )
  }
}

export class AITeleportationEvent extends AIEvent {
  constructor(private levelMap: LevelMap, game: Game) {
    super(game)
  }

  public run(): void {
    // TODO: Rethink whether should be here
    this.game.player.rebuildVision(this.levelMap)
    this.game.playerTurn = true
    this.game.player.ai.presenter = new TeleportationPresenter(
      this.levelMap,
      this.game
    )
  }
}

export class PlayerAI extends MetaAI {
  public presenter: Presenter | null = null
  public levelUps: number = 0

  public act(
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    this.presenter = new IdlePresenter(levelMap, game)
    game.playerTurn = true

    return
  }

  public endTurn(game: Game, levelMap: LevelMap): void {
    let event = this.events.pop()
    if (event) {
      event.run()
    } else if (game && levelMap) {
      game.player.on(new AfterEvent(levelMap, game))

      let event = this.events.pop()
      if (event) {
        event.run()
      } else {
        game.player.ai.runEvents()
        game.playerTurn = false
        this.presenter = null
      }
    }
  }

  public redirect(presenter: Presenter): void {
    this.presenter = presenter
  }
}

export class PlayerBorgAI extends PlayerAI {
  constructor(private ai: MetaAI) {
    super()
  }

  public act(
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    let event = this.ai.act(player, levelMap, game)

    game.playerTurn = true

    return event
  }
}
