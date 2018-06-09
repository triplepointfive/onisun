import { remove, sum } from 'lodash'
import { Creature } from './onisun'

export class Attribute {
  public modifiers: number[] = []

  constructor(protected max: number, protected current: number = max) {}

  public maximum(): number {
    return this.max
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

export class Characteristics {
  public attack: Attribute
  public defense: Attribute
  public health: Attribute
  public radius: Attribute
  public speed: Attribute

  constructor(
    attack: number,
    defense: number,
    health: number,
    radius: number,
    speed: number
  ) {
    this.attack = new PositiveAttribute(attack)
    this.defense = new PositiveAttribute(defense)
    this.health = new Attribute(health)
    this.radius = new PositiveAttribute(radius)
    this.speed = new PositiveAttribute(speed)
  }

  public damageTo(victim: Creature): number {
    return Math.round(
      (10 * this.attack.currentValue()) /
        victim.characteristics.defense.currentValue()
    )
  }
}
