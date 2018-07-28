import { Game } from './game'
import { Player } from './creature'
import { Profession } from './profession'
import { AIMoveEvent, AIHandleEnvEvent } from './ai/meta_ai'
import { Direction } from './utils'

export enum ScreenType {
  LevelUp,
  Idle,
}

export abstract class Screen {
  public player: Player

  constructor(
    public readonly type: ScreenType,
    protected game: Game,
  ) {
    this.player = this.game.player
  }

  public build() {}

  public onInput(input: any) {
    this.game.screen = undefined
  }
}

export enum IdleInputKey {
  Right,
  Left,
  Down,
  Up,

  UpRight,
  UpLeft,
  DownRight,
  DownLeft,

  Handle,
}

export class IdleScreen extends Screen {
  constructor(game: Game) {
    super(ScreenType.Idle, game)
  }

  public onInput(key: IdleInputKey) {
    this.game.screen = undefined

    switch (key) {
    case IdleInputKey.Right:
      return new AIMoveEvent(Direction.right).act(this.game.player)
    case IdleInputKey.Left:
      return new AIMoveEvent(Direction.left).act(this.game.player)
    case IdleInputKey.Down:
      return new AIMoveEvent(Direction.down).act(this.game.player)
    case IdleInputKey.Up:
      return new AIMoveEvent(Direction.up).act(this.game.player)

    case IdleInputKey.UpRight:
      return new AIMoveEvent(Direction.upRight).act(this.game.player)
    case IdleInputKey.UpLeft:
      return new AIMoveEvent(Direction.upLeft).act(this.game.player)
    case IdleInputKey.DownRight:
      return new AIMoveEvent(Direction.downRight).act(this.game.player)
    case IdleInputKey.DownLeft:
      return new AIMoveEvent(Direction.downLeft).act(this.game.player)

    case IdleInputKey.Handle:
      return new AIHandleEnvEvent().act(this.game.player)
    }
  }
}

export class LevelUpScreen extends Screen {
  public options: Profession[]

  constructor(game: Game) {
    super(ScreenType.LevelUp, game)
    this.options = this.game.professionPicker.available(this.player)
  }

  public onInput(pickedProfession: Profession) {
    while (this.player.levelUps > 0) {
      this.player.characteristics.levelUp(this.player.specie)

      this.player.levelUps -= 1
    }

    let playerProfession = this.player.professions.find(
      profession => profession.id === pickedProfession.id
    )
    if (playerProfession) {
      playerProfession.level += 1
    } else {
      this.player.professions.push(pickedProfession)
    }

    // this.onDone()
    this.game.screen = undefined
  }
}
