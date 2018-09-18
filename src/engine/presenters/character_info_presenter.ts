import { Presenter, PresenterType } from './internal'

export class CharacterInfoPresenter extends Presenter {
  get type(): PresenterType {
    return PresenterType.CharacterInfo
  }
}
