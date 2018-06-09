import { ItemGroup, ItemKind, Equipment } from './internal'

import { BodyPart } from '../inventory'
import { Creature } from '../creature'

export abstract class Weapon extends Equipment {
  constructor(kind: ItemKind, name: string, private attackModifier: number) {
    super(ItemGroup.Weapon, kind, name)
  }

  public bodyPart(): BodyPart {
    return BodyPart.RightHand
  }

  public onPutOn(creature: Creature): void {
    creature.characteristics.attack.addModifier(this.attackModifier)
  }

  public onTakeOff(creature: Creature): void {
    creature.characteristics.attack.removeModifier(this.attackModifier)
  }
}

export class Katana extends Weapon {
  constructor() {
    super(ItemKind.Katana, 'Katana', 3)
  }
}
