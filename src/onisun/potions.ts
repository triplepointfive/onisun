import { Potion } from '../engine/items';
import { Game } from '../engine';

export class HealPotion extends Potion {
  constructor() {
    super('Зелье лечения')
  }

  public onDrink(game: Game) {
    game.player.characteristics.health.increase(5)
  }
}
