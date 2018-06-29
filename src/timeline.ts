import { forEach, keys, min, remove, size, pullAt } from 'lodash'

export class Timeline<T> {
  private step: number = 0
  private turns: { [key: number]: T[] } = {}

  public add(item: T, delta: number): void {
    const ts = this.step + delta

    if (this.turns[ts]) {
      this.turns[ts].push(item)
    } else {
      this.turns[ts] = [item]
    }
  }

  public remove(item: T): void {
    forEach(this.turns, (value, key) => {
      remove(value, element => element === item)
    })
  }

  public next(): T {
    this.step = min(keys(this.turns).map(x => parseInt(x)))

    const [element] = pullAt(this.turns[this.step], 0)

    if (this.turns[this.step].length === 0) {
      delete this.turns[this.step]
    }

    return element
  }

  public actors(): T[] {
    if (size(this.turns) === 0) {
      return []
    }

    this.step = min(keys(this.turns).map(x => parseInt(x)))
    const actors = this.turns[this.step]

    delete this.turns[this.step]

    return actors
  }
}
