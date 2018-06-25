export class Level {
  public current: number = 1
  public currentExperience: number = 0
  public requiredExperience: number

  private doneLeveling: boolean = false

  constructor(private requires: number[]) {
    this.requiredExperience = this.requires[0]
  }

  public add(exp: number): void {
    if (this.doneLeveling) {
      return
    }

    this.currentExperience += exp

    while (!this.doneLeveling && this.currentExperience >= this.requiredExperience) {
      this.levelUp()
    }
  }

  protected levelUp(): void {
    this.current += 1

    let level = this.requires[this.current - 1]

    if (level) {
      this.currentExperience -= this.requiredExperience
      this.requiredExperience = level
    } else {
      this.currentExperience = this.requiredExperience
      this.doneLeveling = true
    }
  }
}
