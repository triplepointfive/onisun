import { Player } from './creature'

export class Profession {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public level: number = 1
  ) {}
}

export abstract class ProfessionPicker {
  public abstract available(player: Player): Profession[]
}

export abstract class Skill {
  constructor(
    public readonly name: string,
    public readonly depth: number,
  ) {}
}
