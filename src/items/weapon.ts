import {
  Item,
  ItemId,
  ItemGroup,
  ItemKind,
} from './internal'

export abstract class Weapon extends Item {
  constructor(kind: ItemKind, name: string) {
    super(
      ItemGroup.Weapon,
      kind,
      name,
    )
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
