import { Screen, ScreenType } from './internal'
import { Game } from 'src/engine'

export class AbilitiesPickingScreen extends Screen {
  constructor(game: Game) {
    super(ScreenType.AbilitiesPicking, game)
  }

  public onInput(professionId: number, skillId: number) {
    const profession = this.player.professions.find(profession => profession.id === professionId)
    profession.skills.find(skill => skill.id === skillId).rank += 1
    profession.points += 1
    this.game.screen = undefined
  }
}
