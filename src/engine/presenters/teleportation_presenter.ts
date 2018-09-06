import { PresenterType } from './internal'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { PickPointPresenter } from './pick_point_presenter'
import { MoveEvent } from '../events/move_event'

export class TeleportationPresenter extends PickPointPresenter<
  string,
  undefined
> {
  constructor(levelMap: LevelMap, game: Game) {
    super(
      PresenterType.Teleportation,
      levelMap,
      game,
      'x',
      ({ x, y }) =>
        levelMap.at(x, y).passibleThrough(this.player) &&
        this.memory.at(x, y).seen
    )
  }

  get title(): string {
    return 'Выберите зону телепортации'
  }

  get body(): undefined[] {
    return []
  }

  protected close(): void {
    if (this.targetPos.eq(this.levelMap.creaturePos(this.player))) {
      this.game.logger.playerTeleportedWhereTheyWere()
    } else {
      this.player.on(new MoveEvent(this.game, this.levelMap, this.targetPos))
    }

    this.endTurn()
  }
}
