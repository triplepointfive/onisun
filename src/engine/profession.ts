import { Player } from './creature'

export class Profession {
  public talents: Talent[] = []
  public readonly depthCost: number = 3

  constructor(
    public readonly id: number,
    public readonly name: string,
    public level: number = 1,
    public points: number = 0
  ) {}
}

export abstract class ProfessionPicker {
  public abstract available(player: Player): Profession[]
}

export enum TalentStatus {
  Available,
  Completed,
  Unavailable,
}

export abstract class Talent {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly depth: number,
    public rank: number,
    public readonly maxRank: number,
    public readonly description: string
  ) {}
}
