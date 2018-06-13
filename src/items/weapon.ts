import { ItemGroup, ItemKind, Equipment } from './internal'

import { BodyPart } from '../inventory'
import { Creature } from '../creature'

export class Weapon extends Equipment {
  constructor(name: string, private attackModifier: number) {
    super(ItemGroup.Weapon, ItemKind.Weapon, name)
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