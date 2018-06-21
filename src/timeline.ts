import { forEach, keys, min, remove, size } from 'lodash'

export class Timeline<T> {
  private step: number = 0
  private turns: { [key: number]: T[] } = {}

  public add(actor: T, delta: number): void {
    const ts = this.step + delta

    if (this.turns[ts]) {
      this.turns[ts].push(actor)
    } else {
      this.turns[ts] = [actor]
    }
  }

  public remove(actor: T): void {
    forEach(this.turns, (value, key) => {
      remove(value, element => element === actor)
    })
  }

  public actors(): T[] {
    if (size(this.turns) === 0) {
      return []
    }

    this.step = min(keys(this.turns).map(parseInt))
    const actors = this.turns[this.step]

    delete this.turns[this.step]

    return actors
  }
}
