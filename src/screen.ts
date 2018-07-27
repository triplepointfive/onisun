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
      return this.player.ai.pushEvent(new AIMoveEvent(Direction.right()))
    case IdleInputKey.Left:
      return this.player.ai.pushEvent(new AIMoveEvent(Direction.left()))
    case IdleInputKey.Down:
      return this.player.ai.pushEvent(new AIMoveEvent(Direction.down()))
    case IdleInputKey.Up:
      return this.player.ai.pushEvent(new AIMoveEvent(Direction.up()))
    case IdleInputKey.Handle:
      return this.player.ai.pushEvent(new AIHandleEnvEvent())
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
