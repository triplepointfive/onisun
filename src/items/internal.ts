export enum ItemGroup {
  Armor,
  Weapon,
}

export enum ItemKind {
  Katana,
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
