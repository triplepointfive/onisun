import { remove, sum } from 'lodash'

export class Attribute {
  public modifiers: number[] = []

  constructor(protected max: number, protected current: number = max) {}

  public maximum(): number {
    return this.max
  }

  public atMax(): boolean {
    return this.max === this.current
  }

  public decrease(modifier: number) {
    this.current -= modifier
  }

  public increase(modifier: number) {
    this.current = Math.min(this.current + modifier, this.max)
  }

  public constantIncrease(modifier: number) {
    this.max += modifier
    this.increase(modifier)
  }

  public constantDecrease(modifier: number) {
    this.max -= modifier
    this.decrease(modifier)
  }

  public addModifier(modifier: number) {
    this.modifiers.push(modifier)
  }

  public removeModifier(modifier: number) {
    remove(this.modifiers, val => val === modifier)
  }

  public currentValue(): number {
    return this.current + sum(this.modifiers)
  }
}

export class PositiveAttribute extends Attribute {
  public currentValue(): number {
    const value = super.currentValue()
    return value >= 1 ? value : 1
  }

  public constantDecrease(modifier: number) {
    this.max = Math.max(1, this.max - modifier)
    this.decrease(modifier)
  }

  public decrease(modifier: number) {
    this.current = Math.max(1, this.current - modifier)
  }
}

export class AttributeSet<T> {
  constructor(
    public attack: T,
    public defense: T,
    public dexterity: T,
    public health: T,
    public radius: T,
    public speed: T
  ) {}

  public with(pairSet: AttributeSet<any>, on: (first: T, second: any) => void) {
    on(this.attack, pairSet.attack)
    on(this.defense, pairSet.defense)
    on(this.health, pairSet.health)
    on(this.radius, pairSet.radius)
    on(this.speed, pairSet.speed)
  }
}

export class Modifier extends AttributeSet<number> {
  constructor({
    attack = 0,
    defense = 0,
    dexterity = 0,
    health = 0,
    radius = 0,
    speed = 0,
  }) {
    super(attack, defense, dexterity, health, radius, speed)
  }

  public withWeight(
    pairSet: Modifier,
    weight: Modifier,
    on: (first: number, second: number, weight: number) => void
  ) {
    on(this.attack, pairSet.attack, weight.attack)
    on(this.defense, pairSet.defense, weight.defense)
    on(this.health, pairSet.health, weight.health)
    on(this.radius, pairSet.radius, weight.radius)
    on(this.speed, pairSet.speed, weight.speed)
  }
}

export class Characteristics extends AttributeSet<Attribute> {
  constructor({ attack, defense, dexterity, health, radius, speed }) {
    super(
      new PositiveAttribute(attack),
      new PositiveAttribute(defense),
      new PositiveAttribute(dexterity),
      new Attribute(health),
      new PositiveAttribute(radius),
      new PositiveAttribute(speed)
    )
  }

  public addModifier(modifier: Modifier) {
    this.with(modifier, (char, mod) => {
      if (mod !== 0) {
        char.addModifier(mod)
      }
    })
  }

  public removeModifier(modifier: Modifier) {
    this.with(modifier, (char, mod) => {
      if (mod !== 0) {
        char.removeModifier(mod)
      }
    })
  }

  public damageTo(victim: Characteristics): number {
    return Math.round(
      (10 * this.attack.currentValue()) / victim.defense.currentValue()
    )
  }

  public misses(victim: Characteristics): boolean {
    let dex = this.dexterity.currentValue()

    return Math.random() > dex / (dex + Math.pow(victim.dexterity.currentValue() * 0.25, 0.8))
  }

  public regenerate(): void {
    this.health.increase(Math.ceil(this.health.maximum() / 20))
  }
}
