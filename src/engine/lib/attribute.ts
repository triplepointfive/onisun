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
