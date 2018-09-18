import { Presenter, PresenterType } from './internal'

export type CharacterInfoPresenterBaseInfo = {
  name: string
  value: string
}

export class CharacterInfoPresenter extends Presenter {
  get type(): PresenterType {
    return PresenterType.CharacterInfo
  }

  get baseInfo(): CharacterInfoPresenterBaseInfo[] {
    return [{ name: 'name', value: this.game.player.name }]
  }
}
