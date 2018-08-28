import { remove, sum } from 'lodash'

export class Attribute {
  public modifiers: number[] = []

  constructor(protected max: number, public current: number = max) {}

  get maximum(): number {
    return this.max
  }

  get atMax(): boolean {
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

  get currentValue(): number {
    return this.current + sum(this.modifiers)
  }
}

export class PositiveAttribute extends Attribute {
  get currentValue(): number {
    const value = super.currentValue
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
