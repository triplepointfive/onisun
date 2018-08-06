import { Player } from './creature'

import { includes, sample, compact } from 'lodash'

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

export class ProfessionPicker {
  constructor(
    private pool: Profession[],
    private maxLevel: number,
    private maxTaken: number
  ) {
  }

  public available(player: Player): Profession[] {
    let professions: Profession[] = []

    if (this.canUpdate(player)) {
      professions.push(this.updatableProfession(player))
    } else if (this.canTakeNewProfession(player)) {
      professions.push(this.newFromPool(player))
    }

    if (this.canTakeNewProfession(player)) {
      professions.push(
        this.newFromPool(player, professions.map(profession => profession.id))
      )
    } else if (this.canUpdate(player)) {
      professions.push(
        this.updatableProfession(
          player,
          professions.map(profession => profession.id)
        )
      )
    }

    return compact(professions)
  }

  protected canUpdate(player: Player): boolean {
    return player.professions.some(
      profession => profession.level < this.maxLevel
    )
  }

  protected updatableProfession(
    player: Player,
    excludeProfessions: number[] = []
  ): Profession {
    return sample(
      player.professions.filter(
        profession => !includes(excludeProfessions, profession.id)
      )
    )
  }

  protected canTakeNewProfession(player: Player): boolean {
    return player.professions.length < this.maxTaken && this.pool.length > player.professions.length
  }

  protected newFromPool(
    player: Player,
    excludeProfessions: number[] = []
  ): Profession {
    const excluding = excludeProfessions.concat(
      player.professions.map(profession => profession.id)
    )
    return sample(
      this.pool.filter(profession => !includes(excluding, profession.id))
    )
  }
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
