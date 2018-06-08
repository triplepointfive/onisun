import { Phantom } from '../creature'
import { BodyPart } from '../inventory'

export enum ItemGroup {
  Armor,
  Weapon,
  Corpse,
}

export enum ItemKind {
  Katana,
  Corpse
}

export type ItemId = number

export class Item {
  private static lastId: ItemId = 0
  public static getId(): ItemId {
    return this.lastId++
  }

  constructor(
    public group: ItemGroup,
    public kind: ItemKind,
    public name: string,
    public id: ItemId = Item.getId(),
  ) {
  }

  public clone(): Item {
    return new Item(
      this.group,
      this.kind,
      this.name,
    )
  }
}

export abstract class Equipment extends Item {
  public abstract bodyPart(): BodyPart
  public canTakeOff(): boolean {
    return true // TODO
  }
  public abstract onPutOn(creature): void
  public abstract onTakeOff(creature): void
}

export class Corpse extends Item {
  constructor(creature: Phantom) {
    super(
      ItemGroup.Corpse,
      ItemKind.Corpse,
      'corpse',
    )
  }
}
