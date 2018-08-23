import { forEach, keys, min, remove, size, pullAt, pickBy } from 'lodash'

export class Timeline<T> {
  public step: number = 0
  public turns: { [key: number]: T[] } = {}

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

    this.turns = pickBy(this.turns, (val: T[]) => val.length > 0)
  }

  public next(): T {
    this.step = this.nextStep()

    const [element] = pullAt(this.turns[this.step], 0)

    if (this.turns[this.step].length === 0) {
      delete this.turns[this.step]
    }

    return element === undefined ? this.next() : element
  }

  public actors(): T[] {
    if (size(this.turns) === 0) {
      return []
    }

    this.step = this.nextStep()
    const actors = this.turns[this.step]

    delete this.turns[this.step]

    return actors
  }

  private nextStep(): number {
    let step = min(keys(this.turns).map(x => parseInt(x)))

    if (step === undefined) {
      throw 'Timeline.nextStep called when there is no ones turn'
    }

    return step
  }
}
