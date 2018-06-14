import { random } from 'lodash'

export class Pool<T> {
  private totalWeight: number = 0
  private items: [number, T][] = []

  constructor(items: [number, T][]) {
    items.forEach(([weight, item]) => this.add(weight, item))
  }

  public add(weight: number, item: T): void {
    if (weight < 1) {
      throw `Item '${item}' weight is lower than 1`
    }

    this.items.push([weight, item])
    this.totalWeight += Math.ceil(weight)
  }

  public pick(): T {
    if (this.items.length === 0) {
      throw 'Tried to use empty pool'
    }

    let pick = random(this.totalWeight - 1)

    return this.items.find(([weight, item]) => {
      pick -= weight

      return pick <= 0
    })[1]
  }
}
