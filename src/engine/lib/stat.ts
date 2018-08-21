export interface Dice {
  count: number
  edges: number
}

export class Stat {
  constructor(
    public base: number,
    public rate: number = 1,
    public extra: number = 0,
    public extraRate: number = 1
  ) {}

  get current(): number {
    return this.base * this.rate - this.extra * this.extraRate
  }

  public add(val: number): void {
    this.base += val
  }

  public subtract(val: number): void {
    this.base -= val
  }
}
