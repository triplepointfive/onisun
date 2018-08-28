import { remove } from 'lodash'

interface Grouping {
  groupsWith(item: Grouping): boolean
}

export interface GroupedItem<Item> {
  count: number
  item: Item
}

export class ItemsBunch<Item extends Grouping> {
  public bunch: GroupedItem<Item>[] = []

  public find(item: Item): GroupedItem<Item> | undefined {
    return this.bunch.find(invItem => invItem.item.groupsWith(item))
  }

  public remove(item: Item, count: number): void {
    const invItem = this.find(item)

    if (invItem === undefined) {
      // TODO: Fail if removes item that's not in bunch yet?
      return
    } else if (invItem.count === count) {
      remove(this.bunch, inventoryItem =>
        inventoryItem.item.groupsWith(invItem.item)
      )
    } else {
      invItem.count -= count
    }
  }

  public put(item: Item, count: number): void {
    const invItem = this.bunch.find(inv => inv.item.groupsWith(item))

    if (invItem) {
      invItem.count += count
    } else {
      this.bunch.push({ count: count, item: item })
    }
  }

  public clone(): ItemsBunch<Item> {
    let bunch = new ItemsBunch<Item>()

    this.bunch.forEach(groupedItem => {
      bunch.put(groupedItem.item, groupedItem.count)
    })

    return bunch
  }
}
