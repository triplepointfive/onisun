import { remove, sum } from 'lodash'
import { Creature } from './onisun'

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

export class Modifier {
  public attack: number
  public defense: number
  public health: number
  public radius: number
  public speed: number

  constructor({
    attack = 0,
    defense = 0,
    health = 0,
    radius = 0,
    speed = 0,
  }) {
    this.attack  = attack
    this.defense = defense
    this.health  = health
    this.radius  = radius
    this.speed   = speed
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

  public addModifier(modifier: Modifier) {
    // TODO: OMG
    if (modifier.attack !== 0) { this.attack.addModifier(modifier.attack) }
    if (modifier.defense !== 0) { this.defense.addModifier(modifier.defense) }
    if (modifier.health !== 0) { this.health.addModifier(modifier.health) }
    if (modifier.speed !== 0) { this.speed.addModifier(modifier.speed) }
    if (modifier.radius !== 0) { this.radius.addModifier(modifier.radius) }
  }

  public removeModifier(modifier: Modifier) {
    // TODO: OMG
    if (modifier.attack !== 0) { this.attack.removeModifier(modifier.attack) }
    if (modifier.defense !== 0) { this.defense.removeModifier(modifier.defense) }
    if (modifier.health !== 0) { this.health.removeModifier(modifier.health) }
    if (modifier.speed !== 0) { this.speed.removeModifier(modifier.speed) }
    if (modifier.radius !== 0) { this.radius.removeModifier(modifier.radius) }
  }

  public damageTo(victim: Characteristics): number {
    return Math.round(
      (10 * this.attack.currentValue()) / victim.defense.currentValue()
    )
  }

  public regenerate(): void {
    this.health.increase(Math.ceil(this.health.maximum() / 20))
  }
}
