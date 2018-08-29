import { Game } from './game'

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

  public abstract onObtain(game: Game): void
}
