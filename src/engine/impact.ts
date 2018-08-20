import { remove } from 'lodash'

export enum ImpactType {
  Blind
}

class Impact {
  private constEffects: string[] = []
  private tempEffects: number = 0

  constructor(public readonly type: ImpactType) {
  }

  public addConstEffect(effect: string): void {
    // TODO: Validate keys do not repeat
    this.constEffects.push(effect)
  }

  public removeConstEffect(effect: string): void {
    remove(this.constEffects, effect)
  }

  public active(): boolean {
    return this.tempEffects === 0 && this.constEffects.length > 0
  }

  public turn(): void {
    if (this.tempEffects >= 1) {
      this.tempEffects -= 1
    }
  }
}

export class ImpactBunch {
  private blindness: Impact = new Impact(ImpactType.Blind)

  public activeImpacts(): ImpactType[] {
    return this.impacts().filter(impact => impact.active()).map(impact => impact.type)
  }

  // public addImpact(type: ImpactType, turns: number): void {
  //   this.bunch.push(new Impact(turns))
  // }

  public addConstImpact(type: ImpactType, effect: string): void {
    this.impactByType(type).addConstEffect(effect)
  }

  public removeConstImpact(type: ImpactType, effect: string): void {
    this.impactByType(type).removeConstEffect(effect)
  }

  // public turn(): void {
  //   this.bunch.forEach(impact => impact.turn())
  //   this.bunch = this.bunch.filter(impact => !impact.done)
  // }

  protected impactByType(type: ImpactType): Impact {
    switch (type) {
      case ImpactType.Blind:
        return this.blindness
    }
  }

  private impacts(): Impact[] {
    return [
      this.blindness
    ]
  }
}
