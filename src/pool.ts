import { random } from 'lodash'

export class Pool<Input, Output> {
  private totalWeight: number = 0
  private items: [number, (Input) => Output][] = []

  constructor(items: [number, (Input) => Output][]) {
    items.forEach(([weight, item]) => this.add(weight, item))
  }

  public add(weight: number, item: (Input) => Output): void {
    if (weight < 1) {
      throw `Item '${item}' weight is lower than 1`
    }

    this.items.push([weight, item])
    this.totalWeight += Math.ceil(weight)
  }

  public pick(input: Input): Output {
    if (this.items.length === 0) {
      throw 'Tried to use empty pool'
    }

    let pick = random(this.totalWeight)

    return this.items.find(([weight, item]) => {
      pick -= weight

      return pick <= 0
    })[1](input)
  }

  public merge(pool: Pool<Input, Output>): Pool<Input, Output> {
    let totalPool = new Pool<Input, Output>([])

    this.items.forEach(([weight, item]) => totalPool.add(weight, item))
    pool.items.forEach(([weight, item]) => totalPool.add(weight, item))

    return totalPool
  }
}
