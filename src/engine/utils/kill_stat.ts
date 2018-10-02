import { sortBy } from 'lodash'

export class KillStat {
  public total: number = 0
  private stat: Map<string, number> = new Map()

  public add(name: string): void {
    const current = this.stat.get(name)
    if (current) {
      this.stat.set(name, current + 1)
    } else {
      this.stat.set(name, 1)
    }
    this.total += 1
  }

  get all(): [string, number][] {
    return sortBy(Array.from(this.stat), ([name, count]) => name)
  }
}
