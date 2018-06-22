export class Level {
  public current: number = 1
  public currentExperience: number = 0
  public requiredExperience: number

  private doneLeveling: boolean = false

  public static requires: number[] = [1]

  constructor() {
    if (Level.requires.length < 1) {
      throw 'There must be at least one level!'
    }

    this.requiredExperience = Level.requires[0]
  }

  public add(exp: number): void {
    if (this.doneLeveling) {
      return
    }

    this.currentExperience += exp

    if (this.currentExperience >= this.requiredExperience) {
      this.levelUp()
    }
  }

  protected levelUp(): void {
    this.current += 1

    let level = Level.requires[this.current]

    if (level) {
      this.currentExperience -= this.requiredExperience
      this.requiredExperience = level
    } else {
      this.currentExperience = this.requiredExperience
      this.doneLeveling = true
    }
  }
}
