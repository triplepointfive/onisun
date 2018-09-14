import { Specie } from '../models/specie'
import { Attribute } from './attribute'

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

export class HealthStat extends Attribute {
  private regenerationRate: number
  private regenerationValue: number

  constructor(
    specie: Specie,
    private currentTurn = 0,
    currentValue = specie.maxHealthValue
  ) {
    super(specie.maxHealthValue, currentValue)

    this.regenerationRate = specie.regenerationRate
    this.regenerationValue = specie.regenerationValue
  }

  public turn(): void {
    this.currentTurn += 1

    if (this.currentTurn >= this.regenerationRate) {
      this.currentTurn = 0
      this.increase(this.regenerationValue)
    }
  }
}

export class StrengthStat extends Stat {
  get meleeAdjustment(): number {
    if (this.current < 5) {
      return -2
    } else if (this.current > 10) {
      return Math.floor((this.current - 10) / 2)
    } else {
      return 0
    }
  }
}

export class DexterityStat extends Stat {
  get missileAdjustment(): number {
    if (this.current < 5) {
      return -2
    } else if (this.current > 10) {
      return Math.floor((this.current - 10) / 2)
    } else {
      return 0
    }
  }
}
