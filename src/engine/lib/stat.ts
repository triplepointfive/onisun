export class Stat {
  constructor(
    public base: number,
    public rate: number = 1,
    public extra: number = 0
  ) {}

  get current(): number {
    return this.base * this.rate - this.extra
  }

  public add(val: number): void {
    this.base += val
  }

  public subtract(val: number): void {
    this.base -= val
  }
}

export class CapacityLimitStat {
  private strengthRatio: number = 5
  private constitutionRatio: number = 3
  private base: number = 10

  constructor(private strength: number, private constitution: number) {}

  public recalculate(strength: number, constitution: number) {
    this.strength = strength
    this.constitution = constitution
  }

  get stressed(): number {
    return (
      this.base +
      this.strength * this.strengthRatio +
      this.constitution * this.constitutionRatio
    )
  }

  get loadedStart(): number {
    return this.stressed * 1.5
  }

  get overloadedStart(): number {
    return this.loadedStart * 2
  }

  get flattenedStart(): number {
    return this.overloadedStart * 3
  }
}
