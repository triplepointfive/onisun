import { random } from 'lodash'

export class Pool<Input, Output> {
  private totalWeight: number = 0
  private items: [number, (input: Input) => Output][] = []

  constructor(items: [number, (input: Input) => Output][]) {
    items.forEach(([weight, item]) => this.add(weight, item))
  }

  public add(weight: number, item: (input: Input) => Output): void {
    if (weight < 1) {
      throw `Item's weight is lower than 1`
    }

    this.items.push([weight, item])
    this.totalWeight += Math.ceil(weight)
  }

  public pick(input: Input): Output {
    if (this.items.length === 0) {
      throw 'Tried to use empty pool'
    }

    let pick = random(this.totalWeight)

    const found = this.items.find(([weight, item]) => {
      pick -= weight

      return pick <= 0
    })

    if (found !== undefined) {
      return found[1](input)
    }

    throw 'Pool failed to pick anything'
  }

  public merge(pool: Pool<Input, Output>): Pool<Input, Output> {
    let totalPool = new Pool<Input, Output>([])

    this.items.forEach(([weight, item]) => totalPool.add(weight, item))
    pool.items.forEach(([weight, item]) => totalPool.add(weight, item))

    return totalPool
  }
}
