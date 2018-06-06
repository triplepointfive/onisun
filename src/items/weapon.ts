import {
  Item,
  ItemId,
  ItemGroup,
  ItemKind,

  Equipment,
} from './internal'

import {
  BodyPart,
} from '../inventory'

export abstract class Weapon extends Equipment {
  constructor(kind: ItemKind, name: string) {
    super(
      ItemGroup.Weapon,
      kind,
      name,
    )
  }

  public bodyPart(): BodyPart {
    return BodyPart.RightHand
  }
}

export class Katana extends Weapon {
  constructor() {
    super(
      ItemKind.Katana,
      'Katana',
    )
  }
}
